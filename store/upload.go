package store

import (
	"context"

	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store/paging"
)

func CreateUpload(c context.Context, record *models.Upload) error {
	return FromContext(c).CreateUpload(record)
}

func FetchUpload(c context.Context, id string) (*models.Upload, error) {
	return FromContext(c).FetchUpload(id)
}

func FetchAllUploads(c context.Context, page paging.Page) ([]*models.Upload, error) {
	return FromContext(c).FetchAllUploads(page)
}

func UploadCount(c context.Context) (int, error) {
	return FromContext(c).UploadCount()
}

func UpdateDownloadCount(c context.Context, uploadId string) error {
	return FromContext(c).UpdateDownloadCount(uploadId)
}
