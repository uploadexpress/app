package controllers

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/config"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store"
	"net/http"
	"time"
)

type UploadController struct {}

func NewUploadController() UploadController {
	return UploadController{}
}

func (uploadController *UploadController) CreateUpload(c *gin.Context) {
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

func (uploadController *UploadController) CreatePreSignedRequest(c *gin.Context) {
	sess, err := session.NewSession(&aws.Config{
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