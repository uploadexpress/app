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

func FindWithPaging(page paging.Page, query bson.M, collection *mgo.Collection) *mgo.Pipe {
	entriesToSkip := page.Size * (page.CurrentPage - 1)

	return collection.Pipe([]bson.M{
		query,
		{"$sort": bson.M{"_id": -1}},
		{"$skip": entriesToSkip},
		{"$limit": page.Size},
	})
}
