package models

type File struct {
	Id            string  `json:"id" bson:"_id"`
	Name          string  `json:"name" bson:"name"`
	Size          int64   `json:"size" bson:"size"`
	PreviewUrl    *string `json:"preview_url,omitempty" bson:"preview_url,omitempty"`
	PreviewHeight *int    `json:"preview_height" bson:"preview_height"`
	PreviewWidth  *int    `json:"preview_width" bson:"preview_width"`
}
