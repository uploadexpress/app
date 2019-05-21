package main

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/uploadexpress/app/server"
)

func main() {
	api := &server.API{Router: gin.New(), Config: viper.New()}

	// Configuration setup
	err := api.SetupConfig()
	if err != nil {
		panic(err)
	}

	// I18n setup
	err = api.SetupI18n()
	if err != nil {
		panic(err)
	}

	// Database setup
	session, err := api.SetupDatabase()
	if err != nil {
		panic(err)
	}
	defer session.Close()

	// Mailer setup
	err = api.SetupMailer()
	if err != nil {
		panic(err)
	}

	// Worker setup
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

	err = api.Router.Run(api.Config.GetString("host_address"))
	if err != nil {
		panic(err)
	}
}
