package mongodb

import (
	"fmt"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"github.com/uploadexpress/app/helpers"
	"github.com/uploadexpress/app/models"
)

func (db *mongo) CreateSettings(settings []models.Setting) error {
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

func (db *mongo) FetchSetting(name string) (*models.Setting, error) {
	session := db.Session.Copy()
	defer session.Close()
	settings := db.C(models.SettingsCollection).With(session)

	setting := &models.Setting{}

	err := settings.Find(bson.M{"name": name}).One(setting)
	if err != nil {
		return nil, helpers.NewError(http.StatusNotFound, "setting_not_found", "Setting not found", err)
	}

	return setting, err
}

func (db *mongo) FetchAllSettings() ([]models.Setting, error) {
	session := db.Session.Copy()
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	var settings []models.Setting
	err := settingsCollection.Find(bson.M{}).All(&settings)
	if err != nil {
		return nil, helpers.NewError(http.StatusInternalServerError, "fetch_settings_failed", err.Error(), err)
	}

	return settings, nil
}

func (db *mongo) EditSettings(settings []models.Setting) ([]models.Setting, error) {
	session := db.Session.Copy()
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	for _, setting := range settings {
		err := settingsCollection.Update(bson.M{"name": setting.Name}, bson.M{"$set": bson.M{"value": setting.Value}})
		if err != nil {
			return nil, helpers.NewError(http.StatusInternalServerError, "settings_update_failed", err.Error(), err)
		}
	}

	err := settingsCollection.Find(bson.M{}).All(&settings)
	if err != nil {
		return nil, helpers.NewError(http.StatusInternalServerError, "fetch_settings_failed", err.Error(), err)
	}

	return settings, nil
}

func (db *mongo) EditSetting(setting models.Setting) ([]models.Setting, error) {
	session := db.Session.Copy()
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	_, err := settingsCollection.Upsert(bson.M{"name": setting.Name}, bson.M{"name": setting.Name, "value": setting.Value})
	if err != nil {
		return nil, helpers.NewError(http.StatusInternalServerError, "settings_update_failed", err.Error(), err)
	}

	settings := []models.Setting{}
	err = settingsCollection.Find(bson.M{}).All(&settings)
	if err != nil {
		return nil, helpers.NewError(http.StatusInternalServerError, "fetch_settings_failed", err.Error(), err)
	}

	return settings, nil
}

func (db *mongo) PutBackground(background models.Image) error {
	session := db.Session.Copy()
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	err := settingsCollection.Update(bson.M{"name": "backgrounds"}, bson.M{"$push": bson.M{"value": background}})
	if err != nil {
		fmt.Println(err)
		return helpers.NewError(http.StatusInternalServerError, "background_creation_error", "could not create the background", err)
	}

	return err
}

func (db *mongo) RemoveBackground(id string) error {
	session := db.Session.Copy()
	defer session.Close()
	settingsCollection := db.C(models.SettingsCollection).With(session)

	err := settingsCollection.Update(bson.M{"name": "backgrounds"}, bson.M{"$pull": bson.M{"value": bson.M{"id": id}}})
	if err != nil {
		fmt.Println(err)
		return helpers.NewError(http.StatusInternalServerError, "background_deletion_error", "could not remove the background", err)
	}

	return err
}
