package controllers

import (
	"net/http"

	"github.com/uploadexpress/app/services/config"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store"
)

// TokenController holds all controller functions related to the Token entity
type TokenController struct{}

// NewTokenController instantiates of the controller
func NewTokenController() TokenController {
	return TokenController{}
}

// CreateToken to create a new Token
func (tc TokenController) CreateToken(c *gin.Context) {
	token := &models.Token{}

	if err := c.BindJSON(token); err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_input", "Failed to bind the body data", err))
		return
	}

	token.Ip = c.ClientIP()
	if err := store.CreateToken(c, token); err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	secret := config.GetString(c, "jwt_secret")
	accessToken, err := helpers.GenerateApiToken(secret, store.Current(c).Id, token.Id)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("token_generation_failed", "Could not generate the access token", err))
		return
	}

	// Only sent once
	token.Token = accessToken

	c.JSON(http.StatusCreated, token)
}

// GetToken from id (in context)
func (tc TokenController) GetToken(c *gin.Context) {
	token, err := store.FindTokenById(c, c.Param("id"))

	if err != nil {
		c.AbortWithError(http.StatusNotFound, helpers.ErrorWithCode("Token_not_found", "The token does not exist", err))
		return
	}

	c.JSON(http.StatusOK, token)
}

// GetAllTokens to get all Tokens
func (tc TokenController) GetAllTokens(c *gin.Context) {
	tokens, err := store.GetAllTokens(c)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, tokens)
}

//UpdateToken updates the Token entity
func (tc TokenController) UpdateToken(c *gin.Context) {
	newToken := models.Token{}

	err := c.BindJSON(&newToken)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_input", "Failed to bind the body data", err))
		return
	}

	_, err = store.FindTokenById(c, c.Param("id"))
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("Token_not_found", "Failed to find Token id", err))
		return
	}

	err = store.UpdateToken(c, c.Param("id"), params.M{"$set": newToken})
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, nil)
}

// DeleteToken to delete an existing Token
func (tc TokenController) DeleteToken(c *gin.Context) {
	err := store.DeleteToken(c, c.Param("id"))

	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, nil)
}
