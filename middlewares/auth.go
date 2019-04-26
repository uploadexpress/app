package middlewares

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/services/config"
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

		token := authHeaderParts[1]
		secret := config.GetString(c, "jwt_secret")
		tokenAudience, err := helpers.GetTokenAudience(token, secret)
		if err != nil {
			c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_token", "the given token is invalid", err))
			return
		}

		if tokenAudience == "api" {
			if validateApiToken(token, secret, c) {
				c.Next()
			}
			return
		}

		if validateAccessToken(token, secret, c) {
			c.Next()
		}
	}
}

func validateAccessToken(token, secret string, c *gin.Context) bool {
	claims, err := helpers.ValidateJwtToken(token, secret, "access")
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_token", "the given token is invalid", err))
		return false
	}

	user, err := store.FindUserById(c, claims["sub"].(string))
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("unknown_user", "the given user is invalid", err))
		return false
	}

	c.Set(store.CurrentKey, user)

	return true
}

func validateApiToken(token, secret string, c *gin.Context) bool {
	claims, err := helpers.ValidateJwtToken(token, secret, "api")
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_token", "the given token is invalid", err))
		return false
	}

	_, err = store.FindTokenById(c, claims["iss"].(string))
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("unknown_token", "the token is invalid or expired", err))
		return false
	}

	return true
}
