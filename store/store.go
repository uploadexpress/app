package store

import (
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store/paging"
)

type Store interface {
	CreateUpload(*models.Upload) error
	FetchUpload(string) (*models.Upload, error)
	FetchAllUploads(page paging.Page) ([]*models.Upload, error)
	UploadCount() (int, error)

	CreateUser(*models.User) error
	DeleteUser(*models.User, string) error
	FindUserById(string) (*models.User, error)
	FindUser(params.M) (*models.User, error)
	UserCount() (int, error)

	CreateSettings([]models.Settings) error
	SettingsCount() (int, error)
	FetchAllSettings() ([]models.Settings, error)
}
