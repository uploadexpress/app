package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/uploadexpress/app/worker"
)

func WorkerMiddleware(w *worker.Worker) gin.HandlerFunc {
	return func(c *gin.Context) {
		worker.ToContext(c, w)
		c.Next()
	}
}
