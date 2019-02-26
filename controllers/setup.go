package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store"
)

type SetupController struct{}

func NewSetupController() SetupController {
	return SetupController{}
}

func (sc *SetupController) IsAppSetup(c *gin.Context) {
	userCount, err := store.UserCount(c)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"setup": userCount > 0})
}

func (sc *SetupController) SetupApp(c *gin.Context) {
	// First check the setup is complete
	userCount, err := store.UserCount(c)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	if userCount > 0 {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("setup_already_complete", "you already setup your instance", nil))
		return
	}

	// Create the user from the input
	user := &models.User{}
	if err := c.BindJSON(user); err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_input", "Failed to bind the body data", err))
		return
	}

	if err := store.CreateUser(c, user); err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, user.Sanitize())
}
