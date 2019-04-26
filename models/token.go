package models

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type Token struct {
	Id           string  `json:"id" bson:"_id"`
	Name         string  `json:"name" bson:"name"`
	Ip           string  `json:"ip" bson:"ip"`
	CreationDate int64   `json:"creation_date" bson:"creation_date"`
	Token        *string `json:"token,omitempty" bson:"-"`
}

func (token *Token) BeforeCreate() error {
	token.Id = bson.NewObjectId().Hex()
	token.CreationDate = time.Now().Unix()
	return nil
}

const TokensCollection = "tokens"
