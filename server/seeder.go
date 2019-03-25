package server

import (
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store/mongodb"
	"gopkg.in/mgo.v2/bson"
)

func (a *API) SetupSeeds() error {
	store := mongodb.New(a.Database)

	settingsCount, err := store.SettingsCount()
	if err != nil {
		return err
	}

	if settingsCount == 0 {
		settingsDefaults := []models.Setting{
			{
				Name:  "name",
				Value: "upload.express",
			},
			{
				Name:  "description",
				Value: "A file uploading service",
			},
			{
				Name:  "color",
				Value: "#ffffff",
			},
			{
				Name:  "menu_position",
				Value: "flex-end",
			},
			{
				Name:  "upload_position",
				Value: "center",
			},
			{
				Name:  "backgrounds",
				Value: []models.Image{},
			},
			{
				Name:  "transition_duration",
				Value: 15,
			},
			{
				Name:  "logo",
				Value: nil,
			},
			{
				Name:  "public_uploader",
				Value: false,
			},
			{
				Name:  "setup",
				Value: false,
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
			{
				Name: "links",
				Value: []models.Link{
					{
						Id:   bson.NewObjectId().Hex(),
						Name: "Website",
						Url:  "https://upload.express",
					},
				},
			},
		}

		err = store.CreateSettings(settingsDefaults)
		if err != nil {
			return err
		}
	}

	return nil
}
