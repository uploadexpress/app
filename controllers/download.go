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

type DownloaderController struct { }

func NewDownloaderController() DownloaderController {
	return DownloaderController{}
}

func (downloaderController DownloaderController) GetDownload(c *gin.Context) {
	downloadId := c.Param("id")

	upload, err := store.FetchUpload(c, downloadId)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, upload)
}


func (downloaderController DownloaderController) GetDownloadLink(c *gin.Context) {
	downloadId := c.Param("download_id")
	fileId := c.Param("file_id")

	upload, err := store.FetchUpload(c, downloadId)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	var file *models.File
	for _, cFile := range upload.Files {
		if cFile.Id == fileId {
			file = cFile
		}
	}
	if file == nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_file_id", "The file was not found", nil))
		return
	}

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(config.FromContext(c).GetString("aws_region"))},
	)

	// Create S3 service client
	svc := s3.New(sess)

	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(config.FromContext(c).GetString("aws_bucket")),
		Key:    aws.String(upload.Id + "/" + file.Id + "/" + file.Name),
	})
	urlStr, err := req.Presign(time.Hour)

	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("request_sign_failed", "Failed to sign request", nil))
	}

	c.JSON(http.StatusOK, gin.H{"url": urlStr})
}