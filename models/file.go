package models

type File struct {
	Id string `json:"id" bson:"_id"`
	Name string `json:"name" bson:"name"`
	Size int `json:"size" bson:"size"`
}


