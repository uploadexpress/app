package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/uploadexpress/app/server"
)

func main() {
	api := &server.API{Router: gin.Default(), Config: viper.New()}

	// Configuration setup
	err := api.SetupConfig()
	if err != nil {
		panic(err)
	}

	// Database setup
	session, err := api.SetupDatabase()
	if err != nil {
		panic(err)
	}
	defer session.Close()

	err = api.SetupWorker()
	if err != nil {
		panic(err)
	}

	// Router setup
	api.SetupRouter()

	err = api.SetupSeeds()
	if err != nil {
		panic(err)
	}

	port := ":" + os.Getenv("PORT")
	if port == ":" {
		port = ":4000"
	}

	err = api.Router.Run(port)
	if err != nil {
		panic(err)
	}
}
