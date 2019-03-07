package worker

import (
	"context"

	"github.com/uploadexpress/app/jobs"
)

const (
	storeKey = "worker"
)

type Setter interface {
	Set(string, interface{})
}

func FromContext(c context.Context) *Worker {
	return c.Value(storeKey).(*Worker)
}

func ToContext(c Setter, worker *Worker) {
	c.Set(storeKey, worker)
}

func TryEnqueue(c context.Context, job jobs.Job) bool {
	return FromContext(c).TryEnqueue(job)
}
