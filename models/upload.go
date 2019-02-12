package models

type Upload struct {
	Id string `json:"id" bson:"_id,omitempty"`
	Files []*File `json:"files" bson:"files"`
}

const UploadsCollection = "uploads"
