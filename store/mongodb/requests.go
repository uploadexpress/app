package mongodb

import (
	"net/http"

	"github.com/uploadexpress/app/store/paging"

	"github.com/globalsign/mgo/bson"
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
)

// CreateRequest checks if request  already exists, and if not, creates it
func (db *mongo) CreateRequest(request *models.FileRequest) error {
	session := db.Session.Copy()
	defer session.Close()
	requests := db.C(models.FileRequestsCollection).With(session)

	request.Id = bson.NewObjectId().Hex()
	err := requests.Insert(request)
	if err != nil {
		return helpers.NewError(http.StatusInternalServerError, "request_creation_failed", "Failed to insert the request in the database", err)
	}

	return nil
}

// FindRequestById allows to retrieve a request by its id
func (db *mongo) FindRequestById(id string) (*models.FileRequest, error) {
	session := db.Session.Copy()
	defer session.Close()
	requests := db.C(models.FileRequestsCollection).With(session)

	request := &models.FileRequest{}
	err := requests.FindId(id).One(request)
	if err != nil {
		return nil, helpers.NewError(http.StatusNotFound, "request_not_found", "Request not found", err)
	}

	return request, err
}

// GetAllRequest allows to get all requests
func (db *mongo) GetAllRequests(page paging.Page) ([]*models.FileRequest, error) {
	session := db.Session.Copy()
	defer session.Close()

	requests := db.C(models.FileRequestsCollection).With(session)

	list := []*models.FileRequest{}
	if err := FindWithPaging(page, bson.M{
		"$lookup": bson.M{
			"from":         models.UploadsCollection,
			"localField":   "_id",
			"foreignField": "request_id",
			"as":           "uploads",
		},
	}, requests).All(&list); err != nil {
		return nil, helpers.NewError(http.StatusNotFound, "requests_not_found", "Request not found", err)
	}

	return list, nil
}

// UpdateRequest allows to update one or more request characteristics
func (db *mongo) UpdateRequest(requestId string, params params.M) error {
	session := db.Session.Copy()
	defer session.Close()
	requests := db.C(models.FileRequestsCollection).With(session)

	if err := requests.UpdateId(requestId, params); err != nil {
		return helpers.NewError(http.StatusInternalServerError, "request_update_failed", "Failed to update the request", err)
	}

	return nil
}

// DeleteRequest allows to delete a request by its id
func (db *mongo) DeleteRequest(requestId string) error {
	session := db.Session.Copy()
	defer session.Close()
	requests := db.C(models.FileRequestsCollection).With(session)

	err := requests.Remove(bson.M{"_id": requestId})
	if err != nil {
		return helpers.NewError(http.StatusInternalServerError, "request_delete_failed", "Failed to delete the request", err)
	}

	return nil
}

func (db *mongo) RequestCount() (int, error) {
	session := db.Session.Copy()
	defer session.Close()
	requests := db.C(models.FileRequestsCollection).With(session)

	count, err := requests.Count()
	if err != nil {
		return 0, helpers.NewError(http.StatusInternalServerError, "request_count_failed", "Failed to count the requests", err)
	}

	return count, nil
}
