package server

import (
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/store/mongodb"
	"gopkg.in/mgo.v2/bson"
)

func (a *API) SetupSeeds() error {
	store := mongodb.New(a.Database)

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
			Name: "links",
			Value: []models.Link{
				{
					Id:   bson.NewObjectId().Hex(),
					Name: "Website",
					Url:  "https://upload.express",
				},
			},
		},
		{
			Name: "social_networks",
			Value: []models.Link{
				{
					Id:   bson.NewObjectId().Hex(),
					Name: "twitter",
					Url:  "https://www.twitter.com/upload.express",
				},
				{
					Id:   bson.NewObjectId().Hex(),
					Name: "facebook",
					Url:  "https://www.facebook.com/upload.express",
				},
				{
					Id:   bson.NewObjectId().Hex(),
					Name: "instagram",
					Url:  "https://www.instagram.com/upload.express",
				},
			},
		},
	}

	var settingsToCreate []models.Setting
	for _, setting := range settingsDefaults {
		exists, err := store.SettingExists(setting.Name)
		if err != nil {
			return err
		}

		if !exists {
			settingsToCreate = append(settingsToCreate, setting)
		}
	}

	if len(settingsToCreate) > 0 {
		err := store.CreateSettings(settingsToCreate)
		if err != nil {
			return err
		}
	}

	return nil
}
