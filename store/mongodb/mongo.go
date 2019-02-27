package mongodb

import (
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/uploadexpress/app/store/paging"
)

type mongo struct {
	*mgo.Database
}

func New(database *mgo.Database) *mongo {
	return &mongo{database}
}

func FindWithPaging(page paging.Page, query bson.M, collection *mgo.Collection) *mgo.Query {
	entriesToSkip := page.Size * (page.CurrentPage - 1)
	return collection.Find(query).Sort("-_id").Skip(entriesToSkip).Limit(page.Size)
}
