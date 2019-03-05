package store

import (
	"context"

	"github.com/uploadexpress/app/models"
)

func CreateSettings(c context.Context, settings []models.Setting) error {
	return FromContext(c).CreateSettings(settings)
}

func SettingsCount(c context.Context) (int, error) {
	return FromContext(c).SettingsCount()
}

func FetchSetting(c context.Context, name string) (*models.Setting, error) {
	return FromContext(c).FetchSetting(name)
}

func FetchAllSettings(c context.Context) ([]models.Setting, error) {
	return FromContext(c).FetchAllSettings()
}

func EditSettings(c context.Context, settings []models.Setting) ([]models.Setting, error) {
	return FromContext(c).EditSettings(settings)
}

func EditSetting(c context.Context, setting models.Setting) ([]models.Setting, error) {
	return FromContext(c).EditSetting(setting)
}

func PutBackground(c context.Context, image models.Image) error {
	return FromContext(c).PutBackground(image)
}

func RemoveBackground(c context.Context, id string) error {
	return FromContext(c).RemoveBackground(id)
}
