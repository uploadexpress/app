package store

import "github.com/uploadexpress/app/models"

type Store interface {
	CreateUpload(*models.Upload) error
	FetchUpload(string) (*models.Upload, error)
}