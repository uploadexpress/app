package main

import (
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

	// Router setup
	api.SetupRouter()

	err = api.Router.Run(api.Config.GetString("host_address"))
	if err != nil {
		panic(err)
	}
}
