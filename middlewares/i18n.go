package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/nicksnyder/go-i18n/v2/i18n"
	i18nContext "github.com/uploadexpress/app/services/i18n"
)

func I18nMiddleware(b *i18n.Bundle) gin.HandlerFunc {
	return func(c *gin.Context) {
		i18nContext.ToContext(c, b)
		c.Next()
	}
}
