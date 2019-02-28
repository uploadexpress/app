package store

import (
	"context"

	"github.com/uploadexpress/app/models"
)

func CreateSettings(c context.Context, settings []models.Settings) error {
	return FromContext(c).CreateSettings(settings)
}

func SettingsCount(c context.Context) (int, error) {
	return FromContext(c).SettingsCount()
}

func FetchAllSettings(c context.Context) ([]models.Settings, error) {
	return FromContext(c).FetchAllSettings()
}
