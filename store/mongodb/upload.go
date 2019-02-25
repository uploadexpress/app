package mongodb

import (
	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
	"net/http"
)

func (db *mongo) CreateUpload(upload *models.Upload) (error) {
	session := db.Session.Copy()
	defer session.Close()
	uploads := db.C(models.UploadsCollection).With(session)

	upload.BeforeCreate()
	err := uploads.Insert(upload)
	if err != nil {
		return helpers.NewErrorWithTrace(http.StatusInternalServerError, "upload_creation_failed", "Failed to insert the upload in the database", err)
	}

	return nil
}

func (db *mongo) FetchUpload(id string) (*models.Upload, error) {
	session := db.Session.Copy()
	defer session.Close()
	uploads := db.C(models.UploadsCollection).With(session)

	upload := &models.Upload{}
	err := uploads.FindId(id).One(upload)
	if err != nil {
		return nil, helpers.NewError(http.StatusNotFound, "upload_not_found", "Upload not found", err)
	}

	return upload, err
}