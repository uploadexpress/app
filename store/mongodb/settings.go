package mongodb

import (
	"net/http"

	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
)

func (db *mongo) CreateSettings(settings []models.Settings) error {
	session := db.Session.Copy()
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	settingsInterface := []interface{}{settings}
	err := settingsCollection.Insert(settingsInterface...)
	if err != nil {
		return helpers.NewError(http.StatusInternalServerError, "settings_creation_error", "could not create the settings", err)
	}

	return err
}
