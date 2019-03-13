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
	AttachPreview(string, string, string, string, int, int) error
	UploadCount() (int, error)
	UpdateDownloadCount(string) error
	EditUpload(string, params.M) error

	CreateUser(*models.User) error
	DeleteUser(*models.User, string) error
	FindUserById(string) (*models.User, error)
	FindUser(params.M) (*models.User, error)
	UserCount() (int, error)

	CreateSettings([]models.Setting) error
	SettingsCount() (int, error)
	FetchAllSettings() ([]models.Setting, error)
	FetchSetting(string) (*models.Setting, error)
	EditSettings([]models.Setting) ([]models.Setting, error)
	EditSetting(models.Setting) ([]models.Setting, error)
	PutBackground(models.Image) error
	RemoveBackground(string) error
}
