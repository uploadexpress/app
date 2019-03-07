package models

type File struct {
	Id         string  `json:"id" bson:"_id"`
	Name       string  `json:"name" bson:"name"`
	Size       int64   `json:"size" bson:"size"`
	PreviewUrl *string `json:"preview_url,omitempty" bson:"preview_url,omitempty"`
}
