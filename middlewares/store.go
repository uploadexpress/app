package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo"
	"github.com/uploadexpress/app/store"
	"github.com/uploadexpress/app/store/mongodb"
)

func StoreMiddleware(db *mgo.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		store.ToContext(c, mongodb.New(db))
		c.Next()
	}
}