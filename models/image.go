package models

type Image struct {
	Id     string `json:"id" bson:"id"`
	Url    string `json:"url" bson:"url"`
	Remote bool   `json:"-" bson:"remote"`
}
