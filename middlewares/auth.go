package middlewares

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/config"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/store"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenReader := c.Request.Header.Get("Authorization")

		authHeaderParts := strings.Split(tokenReader, " ")
		if len(authHeaderParts) != 2 || strings.ToLower(authHeaderParts[0]) != "bearer" {
			c.AbortWithError(http.StatusBadRequest, errors.New("Authorization header format must be Bearer {token}"))
			return
		}

		secret := config.GetString(c, "jwt_secret")
		claims, err := helpers.ValidateJwtToken(authHeaderParts[1], secret, "access")
		if err != nil {
			c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_token", "the given token is invalid", err))
			return
		}

		user, _ := store.FindUserById(c, claims["sub"].(string))
		c.Set(store.CurrentKey, user)

		c.Next()
	}
}
