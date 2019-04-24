package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/services/config"
	"github.com/uploadexpress/app/store"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
}

func NewAuthController() AuthController {
	return AuthController{}
}

func (ac AuthController) Authenticate(c *gin.Context) {
	userInput := models.User{}
	if err := c.Bind(&userInput); err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_input", "Failed to bind the body data", err))
		return
	}

	user, err := store.FindUser(c, params.M{"email": userInput.Email})
	if err != nil {
		c.AbortWithError(http.StatusNotFound, helpers.ErrorWithCode("user_does_not_exist", "User does not exist", err))
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userInput.Password))
	if err != nil {
		c.AbortWithError(http.StatusUnauthorized, helpers.ErrorWithCode("incorrect_password", "Password is not correct", err))
		return
	}

	secret := config.GetString(c, "jwt_secret")
	accessToken, err := helpers.GenerateAccessToken(secret, user.Id)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("token_generation_failed", "Could not generate the access token", err))
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": accessToken, "user": user.Sanitize()})
}
