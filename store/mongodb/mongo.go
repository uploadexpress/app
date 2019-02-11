package mongodb

import "github.com/globalsign/mgo"

type mongo struct {
	*mgo.Database
}

func New(database *mgo.Database) *mongo {
	return &mongo{database}
}

