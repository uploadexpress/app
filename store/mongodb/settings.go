package mongodb

import (
	"fmt"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
)

func (db *mongo) CreateSettings(settings []models.Settings) error {
	session := db.Session.Copy()
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	settingsInterface := []interface{}{}
	for _, setting := range settings {
		setting.Id = bson.NewObjectId().Hex()
		settingsInterface = append(settingsInterface, setting)
	}

	err := settingsCollection.Insert(settingsInterface...)
	if err != nil {
		fmt.Println(err.Error())
		return helpers.NewError(http.StatusInternalServerError, "settings_creation_error", "could not create the settings", err)
	}

	return err
}

func (db *mongo) SettingsCount() (int, error) {
	session := db.Session.Copy()
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	count, err := settingsCollection.Count()
	if err != nil {
		return 0, helpers.NewError(http.StatusInternalServerError, "settings_count_error", "could not count the settings", err)
	}

	return count, nil
}

func (db *mongo) FetchAllSettings() ([]models.Settings, error) {
	session := db.Session
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	var settings []models.Settings
	err := settingsCollection.Find(bson.M{}).All(&settings)
	if err != nil {
		return nil, helpers.NewError(http.StatusInternalServerError, "fetch_settings_failed", err.Error(), err)
	}

	return settings, nil
}
