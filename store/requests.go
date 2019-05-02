package store

import (
	"context"

	"github.com/uploadexpress/app/store/paging"

	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
)

//CreateRequest checks if request already exists, and if not, creates it
func CreateRequest(c context.Context, record *models.FileRequest) error {
	return FromContext(c).CreateRequest(record)
}

// FindRequestById allows to retrieve a request by its id
func FindRequestById(c context.Context, id string) (*models.FileRequest, error) {
	return FromContext(c).FindRequestById(id)
}

// GetAllRequest allows to get all requests
func GetAllRequests(c context.Context, page paging.Page) ([]*models.FileRequest, error) {
	return FromContext(c).GetAllRequests(page)
}

// UpdateRequest allows to update one or more request characteristics
func UpdateRequest(c context.Context, requestId string, params params.M) error {
	return FromContext(c).UpdateRequest(requestId, params)
}

// DeleteRequest allows to delete a request by its id
func DeleteRequest(c context.Context, requestId string) error {
	return FromContext(c).DeleteRequest(requestId)
}

func RequestCount(c context.Context) (int, error) {
	return FromContext(c).RequestCount()
}
