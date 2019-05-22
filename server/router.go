package server

import (
	"net/http"
	"time"

	"github.com/gin-contrib/gzip"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/controllers"
	"github.com/uploadexpress/app/middlewares"
)

func Index(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "You successfully reached the upload.express API."})
}

func (a *API) SetupRouter() {
	router := a.Router

	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(gin.Recovery())
	router.Use(middlewares.Logger())
	router.Use(middlewares.ErrorMiddleware())
	router.Use(middlewares.ConfigMiddleware(a.Config))
	router.Use(middlewares.StoreMiddleware(a.Database))
	router.Use(middlewares.CorsMiddleware(middlewares.Config{
		Origins:         "*",
		Methods:         "GET, PUT, POST, DELETE",
		RequestHeaders:  "Origin, Authorization, Content-Type",
		ExposedHeaders:  "ETag",
		MaxAge:          50 * time.Second,
		Credentials:     true,
		ValidateHeaders: false,
	}))
	router.Use(middlewares.StaticMiddleware("/", middlewares.StaticLocalFile("front", false)))
	router.Use(middlewares.EmailMiddleware(a.Mailer))
	router.Use(middlewares.I18nMiddleware(a.I18n))
	router.Use(middlewares.WorkerMiddleware(a.Worker))

	authMiddleware := middlewares.AuthMiddleware()
	uploaderController := controllers.NewUploadController()

	v1 := router.Group("/v1")
	{
		v1.GET("/", Index)

		authentication := v1.Group("/auth")
		{
			authController := controllers.NewAuthController()
			authentication.POST("/", authController.Authenticate)
		}

		setup := v1.Group("/setup")
		{
			setupController := controllers.NewSetupController()
			setup.GET("/status", setupController.Status)
			setup.POST("/", setupController.SetupApp)
		}

		uploader := v1.Group("/uploader")
		{
			uploader.POST("/", uploaderController.Create)
			uploader.PUT("/:upload_id/complete", uploaderController.CompleteUpload)
			uploader.GET("/:upload_id/file/:file_id/upload_url", uploaderController.CreatePreSignedRequest)
			uploader.GET("/:upload_id/file/:file_id/create_multipart", uploaderController.CreateMultiPartUpload)
			uploader.GET("/:upload_id/file/:file_id/part_url/:s3_upload_id/part/:part_number", uploaderController.CreateUploadPartPreSignedRequest)
			uploader.PUT("/:upload_id/file/:file_id/upload/:s3_upload_id/part/:part_number", uploaderController.UploadPart)
			uploader.POST("/:upload_id/file/:file_id/complete_multipart/:s3_upload_id", uploaderController.CompleteMultiPartUpload)
			uploader.PUT("/:upload_id/file/:file_id/upload", uploaderController.UploadFile)
			uploader.POST("/:upload_id/mail", uploaderController.SendMail)
			uploader.Use(authMiddleware)
			uploader.GET("/", uploaderController.Index)
			uploader.DELETE("/:upload_id/", uploaderController.DeleteUpload)
			uploader.POST("/:upload_id/background", uploaderController.AttachBackground)
		}

		downloader := v1.Group("/downloader")
		{
			downloaderController := controllers.NewDownloaderController()
			downloader.GET("/:download_id", downloaderController.Show)
			downloader.GET("/:download_id/file/:file_id/download_url", downloaderController.GetDownloadLink)
			downloader.GET("/:download_id/zip", downloaderController.DownloadZip)
			downloader.POST("/:download_id/selection/zip", downloaderController.CreateZipWithSelection)
		}

		settings := v1.Group("/settings")
		{
			settingsController := controllers.NewSettingsController()
			settings.GET("/", settingsController.Index)
			settings.Use(authMiddleware)
			settings.PUT("/", settingsController.Edit)
			settings.POST("/logo/", settingsController.CreateLogo)
			settings.POST("/background/", settingsController.CreateBackground)
			settings.DELETE("/background/:id/", settingsController.DeleteBackground)
			settings.DELETE("/logo/", settingsController.DeleteLogo)

		}

		tokens := v1.Group("/tokens")
		{
			tokensController := controllers.NewTokenController()
			tokens.Use(authMiddleware)
			tokens.POST("/", tokensController.CreateToken)
			tokens.GET("/", tokensController.GetAllTokens)
			tokens.PUT("/:id", tokensController.UpdateToken)
			tokens.DELETE("/:id", tokensController.DeleteToken)
		}

		requests := v1.Group("/requests")
		{
			requestsController := controllers.NewRequestController()
			requests.GET("/:id/", requestsController.GetRequest)
			requests.Use(authMiddleware)
			requests.GET("/", requestsController.GetAllRequests)
			requests.POST("/", requestsController.CreateRequest)
			requests.PUT("/:id/", requestsController.UpdateRequest)
			requests.DELETE("/:id/", requestsController.DeleteRequest)
		}
	}

	router.PUT("/upload/:upload_name", uploaderController.CreateDirectUpload)

	staticController := controllers.NewStaticController()
	router.LoadHTMLFiles("front/index.html")
	router.NoRoute(staticController.RenderIndex)
}
