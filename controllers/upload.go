package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/uploadexpress/app/store/paging"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/config"
	"github.com/uploadexpress/app/constants"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store"
)

type UploadController struct{}

func NewUploadController() UploadController {
	return UploadController{}
}

func (uploadController *UploadController) CreateUpload(c *gin.Context) {
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

func (uploadController *UploadController) ListUploads(c *gin.Context) {
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
	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(
			config.FromContext(c).GetString("aws_access_key_id"),
			config.FromContext(c).GetString("aws_secret_access_key"),
			"", // a token will be created when the session it's used.
		),
		Region: aws.String(config.FromContext(c).GetString("aws_region"))},
	)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_aws_credentials", "The server has invalid AWS credentials", err))
		return
	}

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

	svc := s3.New(sess)
	req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(config.FromContext(c).GetString("aws_bucket")),
		Key:    aws.String(uploadId + "/" + file.Id + "/" + file.Name),
	})
	str, err := req.Presign(time.Hour)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("request_sign_failed", "Failed to sign request", nil))
	}

	c.JSON(http.StatusOK, gin.H{"url": str})
}
