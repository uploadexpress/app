package server

import (
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store/mongodb"
)

func (a *API) SetupSeeds() error {
	store := mongodb.New(a.Database)

	settingsCount, err := store.SettingsCount()
	if err != nil {
		return err
	}

	if settingsCount == 0 {
		settingsDefaults := []models.Settings{
			{
				Name:  "name",
				Value: "upload.express",
			},
			{
				Name:  "description",
				Value: "A file uploading service",
			},
			{
				Name:  "twitter",
				Value: "https://www.twitter.com/upload.express",
			},
			{
				Name:  "facebook",
				Value: "https://www.facebook.com/upload.express",
			},
			{
				Name:  "instagram",
				Value: "https://www.instagram.com/upload.express",
			},
		}

		err = store.CreateSettings(settingsDefaults)
		if err != nil {
			return err
		}
	}

	return nil
}
