package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/services/email"
)

func EmailMiddleware(e email.EmailSender) gin.HandlerFunc {
	return func(c *gin.Context) {
		email.ToContext(c, e)
		c.Next()
	}
}
