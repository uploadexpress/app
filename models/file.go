package models

type File struct {
	Id              string  `json:"id" bson:"_id"`
	Name            string  `json:"name" bson:"name"`
	Size            int64   `json:"size" bson:"size"`
	PreviewUrl      *string `json:"preview_url,omitempty" bson:"preview_url,omitempty"`
	ThumbnailUrl    *string `json:"thumbnail_url,omitempty" bson:"thumbnail_url,omitempty"`
	ThumbnailHeight *int    `json:"thumbnail_height" bson:"thumbnail_height"`
	ThumbnailWidth  *int    `json:"thumbnail_width" bson:"thumbnail_width"`
}
