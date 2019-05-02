package controllers

import (
	"net/http"

	"github.com/uploadexpress/app/store/paging"

	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store"
)

// RequestController holds all controller functions related to the Request entity
type RequestController struct{}

// NewRequestController instantiates of the controller
func NewRequestController() RequestController {
	return RequestController{}
}

// CreateRequest to create a new Request
func (tc RequestController) CreateRequest(c *gin.Context) {
	request := &models.FileRequest{}

	if err := c.BindJSON(request); err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_input", "Failed to bind the body data", err))
		return
	}

	if err := store.CreateRequest(c, request); err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusCreated, request)
}

// GetRequest from id (in context)
func (tc RequestController) GetRequest(c *gin.Context) {
	request, err := store.FindRequestById(c, c.Param("id"))

	if err != nil {
		c.AbortWithError(http.StatusNotFound, helpers.ErrorWithCode("Request_not_found", "The request does not exist", err))
		return
	}

	c.JSON(http.StatusOK, request)
}

// GetAllRequests to get all Requests
func (tc RequestController) GetAllRequests(c *gin.Context) {
	page := paging.NewFromParams(c.Request.URL.Query().Get("current_page"), c.Request.URL.Query().Get("size"))

	requests, err := store.GetAllRequests(c, page)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	requestCount, err := store.RequestCount(c)
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"paging": gin.H{"current_page": page.CurrentPage, "size": len(requests), "total": (requestCount / page.Size) + 1}, "result": requests})
}

//UpdateRequest updates the Request entity
func (tc RequestController) UpdateRequest(c *gin.Context) {
	newRequest := models.FileRequest{}

	err := c.BindJSON(&newRequest)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, helpers.ErrorWithCode("invalid_input", "Failed to bind the body data", err))
		return
	}

	_, err = store.FindRequestById(c, c.Param("id"))
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, helpers.ErrorWithCode("Request_not_found", "Failed to find Request id", err))
		return
	}

	err = store.UpdateRequest(c, c.Param("id"), params.M{"$set": newRequest})
	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, nil)
}

// DeleteRequest to delete an existing Request
func (tc RequestController) DeleteRequest(c *gin.Context) {
	err := store.DeleteRequest(c, c.Param("id"))

	if err != nil {
		c.Error(err)
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, nil)
}
