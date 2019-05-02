package models

type FileRequest struct {
	Id          string   `json:"id" bson:"_id"`
	Name        string   `json:"name" bson:"name"`
	Description string   `json:"description" bson:"description"`
	Public      bool     `json:"public" bson:"public"`
	Uploads     []Upload `json:"uploads" bson:"uploads,omitempty"` // virtual field
}

const FileRequestsCollection = "file_requests"
