package store

import (
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
)

type Store interface {
	CreateUpload(*models.Upload) error
	FetchUpload(string) (*models.Upload, error)

	CreateUser(*models.User) error
	DeleteUser(*models.User, string) error
	FindUserById(string) (*models.User, error)
	FindUser(params.M) (*models.User, error)
	UserCount() (int, error)
}
