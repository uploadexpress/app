package helpers

import (
	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/models"
)

func FlattenSettings(settings []models.Setting) gin.H {
	flattenedSettings := gin.H{}
	for _, setting := range settings {
		flattenedSettings[setting.Name] = setting.Value
	}
	return flattenedSettings
}
