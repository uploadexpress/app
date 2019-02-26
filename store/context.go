package store

import (
	"github.com/uploadexpress/app/models"
	"golang.org/x/net/context"
)

const (
	CurrentKey = "currentUser"
	StoreKey   = "store"
)

type Setter interface {
	Set(string, interface{})
}

func Current(c context.Context) *models.User {
	return c.Value(CurrentKey).(*models.User)
}

func FromContext(c context.Context) Store {
	return c.Value(StoreKey).(Store)
}

func ToContext(c Setter, store Store) {
	c.Set(StoreKey, store)
}
