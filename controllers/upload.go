package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/constants"
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

	maxSize := 2 * constants.GB
	if upload.Size() > maxSize {
		err := fmt.Errorf("the file are too heavy, maximum upload size: %d", maxSize)
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("files_too_big", err.Error(), err))
		return
	}

	if err := store.CreateUpload(c, upload); err != nil {
		_ = c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, upload)
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

	str, err := s3.CreatePutObjectPreSignedUrl(c, uploadId, *file)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("request_sign_failed", "Failed to sign request", nil))
	}

	c.JSON(http.StatusOK, gin.H{"url": str})
}
