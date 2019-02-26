package store

import (
	"context"

	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
)

func CreateUser(c context.Context, record *models.User) error {
	return FromContext(c).CreateUser(record)
}

func DeleteUser(c context.Context, userId string) error {
	return FromContext(c).DeleteUser(Current(c), userId)
}

func FindUserById(c context.Context, id string) (*models.User, error) {
	return FromContext(c).FindUserById(id)
}

func FindUser(c context.Context, params params.M) (*models.User, error) {
	return FromContext(c).FindUser(params)
}

func UserCount(c context.Context) (int, error) {
	return FromContext(c).UserCount()
}
