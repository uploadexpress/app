package models

type Settings struct {
	Id    string `json:"id" bson:"_id"`
	Name  string `json:"name" bson:"name"`
	Value string `json:"value" bson:"name"`
}

const SettingsCollection = "settings"
