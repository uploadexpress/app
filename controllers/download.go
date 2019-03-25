package controllers

import (
	"archive/zip"
	"io"
	"net/http"

	"github.com/uploadexpress/app/config"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/services/s3"
	"github.com/uploadexpress/app/store"
)

type DownloaderController struct{}

func NewDownloaderController() DownloaderController {
	return DownloaderController{}
}

func (downloaderController DownloaderController) Show(c *gin.Context) {
	downloadId := c.Param("download_id")

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

	urlStr, err := s3.GetObjectLink(config.NewAwsConfigurationFromContext(c), upload.Id, *file)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("request_sign_failed", "Failed to sign request", nil))
		return
	}

	_ = store.UpdateDownloadCount(c, upload.Id) //ignored the error, for analytics only, not fatal.

	c.JSON(http.StatusOK, gin.H{"url": urlStr})
}

func (downloaderController DownloaderController) DownloadZip(c *gin.Context) {
	downloadId := c.Param("download_id")

	upload, err := store.FetchUpload(c, downloadId)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	fileName := "download.zip"
	if !upload.Public {
		fileName = upload.Name + ".zip"
	}

	_ = store.UpdateDownloadCount(c, upload.Id) //ignored the error, for analytics only, not fatal.

	writeZip(c, upload.Id, fileName, upload.Files)
}

func (downloaderController DownloaderController) CreateZipWithSelection(c *gin.Context) {
	downloadId := c.Param("download_id")

	// Parse params
	type CreateZipParams struct {
		Selection []string `json:"selection"`
	}
	var params CreateZipParams

	err := c.BindJSON(&params)
	if err != nil {
		_ = c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_input", "Failed to bind the body data", err))
		return
	}

	// Fetch upload
	upload, err := store.FetchUpload(c, downloadId)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	// Set file name
	fileName := "download.zip"
	if !upload.Public {
		fileName = upload.Name + ".zip"
	}

	// Fetch needed files
	files := make([]*models.File, 0)
	for _, file := range upload.Files {
		files = append(files, file)
	}

	// Write zip to request
	writeZip(c, downloadId, fileName, files)
}

func writeZip(c *gin.Context, uploadId string, fileName string, files []*models.File) {
	zipWriter := zip.NewWriter(c.Writer)

	c.Writer.Header().Add("Content-Disposition", "attachment; filename=\""+fileName+"\"")
	c.Writer.Header().Add("Content-Type", "application/zip")

	for _, file := range files {
		reader, err := s3.GetObjectReader(config.NewAwsConfigurationFromContext(c), uploadId, *file)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("s3_get_object_failed", err.Error(), err))
			return
		}

		header := &zip.FileHeader{
			Name:   file.Name,
			Method: zip.Deflate,
			Flags:  0x800,
		}

		fileHeader, _ := zipWriter.CreateHeader(header)

		_, err = io.Copy(fileHeader, reader)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("file_copy_error", err.Error(), err))
			return
		}

		reader.Close()
	}

	zipWriter.Close()
}
