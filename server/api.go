package server

import (
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	"github.com/spf13/viper"
	"github.com/uploadexpress/app/services/email"
	"github.com/uploadexpress/app/services/worker"
)

type API struct {
	Router   *gin.Engine
	Config   *viper.Viper
	Database *mgo.Database
	Mailer   email.EmailSender
	Worker   *worker.Worker
	I18n     *i18n.Bundle
}
