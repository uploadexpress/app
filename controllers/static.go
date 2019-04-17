package controllers

import (
	"net/http"

	"github.com/uploadexpress/app/config"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/store"
)

type StaticController struct{}

func NewStaticController() StaticController {
	return StaticController{}
}

func (sc StaticController) RenderIndex(c *gin.Context) {
	siteName := "upload.express"
	description := ""

	settings, _ := store.FetchAllSettings(c)
	for _, setting := range settings {
		if setting.Name == "name" {
			siteName = setting.Value.(string)
		}

		if setting.Name == "description" {
			description = setting.Value.(string)
		}
	}

	c.HTML(http.StatusOK, "index.html", gin.H{
		"hostname":    config.GetString(c, "site_url"),
		"title":       siteName,
		"description": description,
	})
}
