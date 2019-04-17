package controllers

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/h2non/filetype"

	"github.com/uploadexpress/app/config"

	"github.com/mitchellh/mapstructure"

	"gopkg.in/mgo.v2/bson"

	"github.com/uploadexpress/app/services/s3"

	"github.com/uploadexpress/app/helpers"

	"github.com/uploadexpress/app/models"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/store"
)

type SettingsController struct{}

func NewSettingsController() SettingsController {
	return SettingsController{}
}

func (sc SettingsController) Index(c *gin.Context) {
	settings, err := store.FetchAllSettings(c)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, helpers.FlattenSettings(settings))
}

func (sc SettingsController) Edit(c *gin.Context) {
	var settings []models.Setting

	params, err := helpers.GetRequestParams(c.Request.Body)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_data", err.Error(), err))
		return
	}

	for key, value := range params {
		if helpers.StringContains(models.ForbiddenSettingsKeys, key) {
			continue
		}

		settings = append(settings, models.Setting{
			Name:  key,
			Value: value,
		})
	}

	settings, err = store.EditSettings(c, settings)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, helpers.FlattenSettings(settings))
}

func (sc SettingsController) CreateLogo(c *gin.Context) {
	logoId := bson.NewObjectId().Hex()

	// Upload logo
	body := c.Request.Body

	var buf bytes.Buffer
	tee := io.TeeReader(body, &buf)

	// Read header
	fileHeader := make([]byte, 261)
	_, err := tee.Read(fileHeader)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("background_header_read_failed", "could not read the header for background image", err))
		return
	}

	// check header type
	if !filetype.IsImage(fileHeader) {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("not_image", "the file is not an image", err))
		return
	}

	// get image extension
	imageType, err := filetype.Match(fileHeader)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("background_header_read_failed", "could not read the header for background image", err))
		return
	}

	multi := io.MultiReader(ioutil.NopCloser(&buf), tee)
	url, err := s3.PutObject(config.NewAwsConfigurationFromContext(c), fmt.Sprintf("logo/%s.%s", logoId, imageType.Extension), multi, true)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("aws_upload_error", err.Error(), err))
		return
	}

	// Fetch current logo
	setting, err := store.FetchSetting(c, "logo")
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	// Remove it from S3 if it exists
	if setting.Value != nil {
		var image models.Image
		err = mapstructure.Decode(setting.Value, &image)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("map_decode_failed", err.Error(), err))
			return
		}

		err = s3.RemoveObject(config.NewAwsConfigurationFromContext(c), fmt.Sprintf("/logo/%s.%s", image.Id, *image.Extension))
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("s3_remove_failed", err.Error(), err))
			return
		}
	}

	// Save new logo in database
	result, err := store.EditSetting(c, models.Setting{
		Name: "logo",
		Value: models.Image{
			Id:        logoId,
			Url:       url,
			Remote:    false,
			Extension: &imageType.Extension,
		},
	})
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, helpers.FlattenSettings(result))
}

func (sc SettingsController) CreateBackground(c *gin.Context) {
	backgroundId := bson.NewObjectId().Hex()
	body := c.Request.Body

	var buf bytes.Buffer
	tee := io.TeeReader(body, &buf)

	// Read header
	fileHeader := make([]byte, 261)
	_, err := tee.Read(fileHeader)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("background_header_read_failed", "could not read the header for background image", err))
		return
	}

	// check header type
	if !filetype.IsImage(fileHeader) {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("not_image", "the file is not an image", err))
		return
	}

	// get image extension
	imageType, err := filetype.Match(fileHeader)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("background_header_read_failed", "could not read the header for background image", err))
		return
	}

	multi := io.MultiReader(ioutil.NopCloser(&buf), tee)
	url, err := s3.PutObject(config.NewAwsConfigurationFromContext(c), fmt.Sprintf("backgrounds/%s.%s", backgroundId, imageType.Extension), multi, true)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("aws_upload_error", err.Error(), err))
		return
	}

	err = store.PutBackground(c, models.Image{
		Id:        backgroundId,
		Url:       url,
		Remote:    false,
		Extension: &imageType.Extension,
	})
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	setting, err := store.FetchSetting(c, "backgrounds")
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, helpers.FlattenSettings([]models.Setting{*setting}))
}

func (sc SettingsController) DeleteBackground(c *gin.Context) {
	id := c.Param("id")
	var background *models.Image

	// retrieve the list of settings
	setting, err := store.FetchSetting(c, "backgrounds")
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	// check the given id exists
	for _, imageMap := range setting.Value.([]interface{}) {
		var image models.Image
		err = mapstructure.Decode(imageMap, &image)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("map_decode_failed", err.Error(), err))
			return
		}

		if image.Id == id {
			background = &image
		}
	}
	if background == nil {
		err = fmt.Errorf("could not find the background id %s", id)
		c.AbortWithError(http.StatusNotFound, helpers.ErrorWithCode("background_not_found", err.Error(), err))
		return
	}

	// delete from S3 if the object isn't a remote image
	if !background.Remote {
		err = s3.RemoveObject(config.NewAwsConfigurationFromContext(c), fmt.Sprintf("backgrounds/%s.%s", id, *background.Extension))
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("aws_deletion_error", err.Error(), err))
			return
		}
	}

	// remove the image from the database
	err = store.RemoveBackground(c, id)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, nil)
}

func (sc SettingsController) DeleteLogo(c *gin.Context) {
	var logo models.Image

	// retrieve the list of settings
	setting, err := store.FetchSetting(c, "logo")
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	err = mapstructure.Decode(setting.Value, &logo)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("map_decode_failed", err.Error(), err))
		return
	}

	// delete from S3 if the object isn't a remote image
	if !logo.Remote {
		err = s3.RemoveObject(config.NewAwsConfigurationFromContext(c), fmt.Sprintf("logo/%s.%s", logo.Id, *logo.Extension))
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("aws_deletion_error", err.Error(), err))
			return
		}
	}

	// remove the image from the database
	settings, err := store.EditSetting(c, models.Setting{
		Name:  "logo",
		Value: nil,
	})
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, settings)
}
