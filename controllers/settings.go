package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/store"
)

type SettingsController struct{}

func NewSettingsController() SettingsController {
	return SettingsController{}
}

func (sc SettingsController) Index(c *gin.Context) {
	settings, err := store.FetchAllSettings(c)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, settings)
}
