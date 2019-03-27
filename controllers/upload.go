package controllers

import (
	"fmt"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"github.com/uploadexpress/app/config"

	"github.com/uploadexpress/app/jobs/thumbgen"
	"github.com/uploadexpress/app/worker"

	"github.com/uploadexpress/app/helpers/params"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/services/s3"
	"github.com/uploadexpress/app/store"
	"github.com/uploadexpress/app/store/paging"
)

type UploadController struct{}

func NewUploadController() UploadController {
	return UploadController{}
}

func (uploadController *UploadController) Create(c *gin.Context) {
	upload := &models.Upload{}

	if err := c.BindJSON(upload); err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_input", "Failed to bind the body data", err))
		return
	}

	if err := store.CreateUpload(c, upload); err != nil {
		_ = c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, upload)
}

func (uploadController *UploadController) CompleteUpload(c *gin.Context) {
	uploadId := c.Param("upload_id")

	upload, err := store.FetchUpload(c, uploadId)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	for _, file := range upload.Files {
		worker.TryEnqueue(c, thumbgen.NewThumbnailGenerator(params.M{"uploadId": upload.Id, "file": *file}))
	}

	err = store.EditUpload(c, uploadId, params.M{"ready": true})
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, nil)
}

func (uploadController *UploadController) Index(c *gin.Context) {
	page := paging.NewFromParams(c.Request.URL.Query().Get("current_page"), c.Request.URL.Query().Get("size"))

	uploads, err := store.FetchAllUploads(c, page)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	uploadCount, err := store.UploadCount(c)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"paging": gin.H{"current_page": page.CurrentPage, "size": len(uploads), "total": (uploadCount / page.Size) + 1}, "result": uploads})
}

func (uploadController *UploadController) CreatePreSignedRequest(c *gin.Context) {
	uploadId := c.Param("upload_id")
	upload, err := store.FetchUpload(c, uploadId)
	if err != nil {
		_ = c.Error(err)
		c.Abort()
		return
	}

	var file *models.File
	for _, cFile := range upload.Files {
		if cFile.Id == c.Param("file_id") {
			file = cFile
		}
	}
	if file == nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_file_id", "The file was not found", nil))
		return
	}

	str, err := s3.CreatePutObjectPreSignedUrl(config.NewAwsConfigurationFromContext(c), uploadId, *file)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("request_sign_failed", err.Error(), nil))
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": str})
}

func (uploadController *UploadController) AttachBackground(c *gin.Context) {
	uploadId := c.Param("upload_id")
	var currentBackgrounds []*models.Image
	upload, err := store.FetchUpload(c, uploadId)
	if err != nil {
		_ = c.Error(err)
		c.Abort()
		return
	}
	currentBackgrounds = upload.Backgrounds

	backgroundId := bson.NewObjectId().Hex()
	body := c.Request.Body
	url, err := s3.PutPublicObject(config.NewAwsConfigurationFromContext(c), fmt.Sprintf("backgrounds/%s/%s.png", upload.Id, backgroundId), body)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("aws_upload_error", err.Error(), err))
		return
	}

	currentBackgrounds = append(currentBackgrounds, &models.Image{
		Id:     backgroundId,
		Url:    url,
		Remote: false,
	})
	err = store.EditUpload(c, uploadId, params.M{"backgrounds": currentBackgrounds})
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, nil)
}

func (uploadController *UploadController) DeleteUpload(c *gin.Context) {
	uploadId := c.Param("upload_id")
	upload, err := store.FetchUpload(c, uploadId)
	if err != nil {
		_ = c.Error(err)
		c.Abort()
		return
	}

	err = s3.RemoveUpload(config.NewAwsConfigurationFromContext(c), upload)
	if err != nil {
		_ = c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("directory_deletion_failed", err.Error(), nil))
		return
	}

	err = store.DeleteUpload(c, upload)
	if err != nil {
		_ = c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, nil)
}
