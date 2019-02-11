package server

import (
	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/controllers"
	"github.com/uploadexpress/app/middlewares"
	"net/http"
	"time"
)

func Index(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "You successfully reached the upload.express API."})
}

func (a *API) SetupRouter() {
	router := a.Router

	router.Use(middlewares.ErrorMiddleware())
	router.Use(middlewares.ConfigMiddleware(a.Config))
	router.Use(middlewares.StoreMiddleware(a.Database))
	router.Use(middlewares.CorsMiddleware(middlewares.Config{
		Origins:         "*",
		Methods:         "GET, PUT, POST, DELETE",
		RequestHeaders:  "Origin, Authorization, Content-Type",
		ExposedHeaders:  "",
		MaxAge:          50 * time.Second,
		Credentials:     true,
		ValidateHeaders: false,
	}))

	v1 := router.Group("/v1")
	{
		v1.GET("/", Index)

		uploader := v1.Group("/uploader")
		{
			uploaderController := controllers.NewUploadController()
			uploader.POST("/", uploaderController.CreateUpload)
			uploader.GET("/:upload_id/file/:file_id/upload_url", uploaderController.CreatePreSignedRequest)
		}

		downloader := v1.Group("/downloader")
		{
			downloaderController := controllers.NewDownloaderController()
			downloader.GET("/:download_id/file/:file_id/download", downloaderController.GetDownloadLink)
			//downloader.GET("/:id", downloaderController.GetDownload)
		}
	}
}