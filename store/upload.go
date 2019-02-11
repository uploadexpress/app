package store

import (
	"context"
	"github.com/uploadexpress/app/models"
)

func CreateUpload(c context.Context, record *models.Upload) error {
	return FromContext(c).CreateUpload(record)
}

func FetchUpload(c context.Context, id string) (*models.Upload, error) {
	return FromContext(c).FetchUpload(id)
}