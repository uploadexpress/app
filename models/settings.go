package models

type Setting struct {
	Id    string      `json:"-" bson:"_id"`
	Name  string      `json:"name" bson:"name"`
	Value interface{} `json:"value" bson:"value"`
}

var ForbiddenSettingsKeys = []string{"backgrounds", "logo"} // Keys that are managed by their own endpoint.
const SettingsCollection = "settings"
