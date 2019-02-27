package mongodb

import (
	"net/http"

	"github.com/globalsign/mgo/bson"
	"github.com/uploadexpress/app/store/paging"

	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
)

func (db *mongo) CreateUpload(upload *models.Upload) error {
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

func (db *mongo) FetchAllUploads(page paging.Page) ([]*models.Upload, error) {
	session := db.Session.Copy()
	defer session.Close()
	uploadsCollection := db.C(models.UploadsCollection).With(session)

	uploads := []*models.Upload{}
	err := FindWithPaging(page, bson.M{}, uploadsCollection).All(&uploads)
	if err != nil {
		return nil, helpers.NewError(http.StatusInternalServerError, "uploads_fetch_error", "the uploads could not be fetched", err)
	}

	return uploads, err
}

func (db *mongo) UploadCount() (int, error) {
	session := db.Session.Copy()
	defer session.Close()
	uploads := db.C(models.UploadsCollection).With(session)

	count, err := uploads.Count()
	if err != nil {
		return 0, helpers.NewError(http.StatusInternalServerError, "upload_count_failed", "Failed to count the uploads", err)
	}

	return count, nil
}
