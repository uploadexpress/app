package models

type Settings struct {
	Id    string `json:"-" bson:"_id"`
	Name  string `json:"name" bson:"name"`
	Value string `json:"value" bson:"value"`
}

const SettingsCollection = "settings"
