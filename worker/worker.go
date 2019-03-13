package worker

import (
	"time"

	"github.com/spf13/viper"
	"github.com/uploadexpress/app/store"

	"github.com/sirupsen/logrus"
	"github.com/uploadexpress/app/jobs"
)

type Worker struct {
	jobChan       chan jobs.Job
	store         store.Store
	configuration *viper.Viper
}

func NewWorker(store store.Store, config *viper.Viper) *Worker {
	return &Worker{
		jobChan:       make(chan jobs.Job, 5000),
		store:         store,
		configuration: config,
	}
}

func (worker *Worker) Run() {
	logrus.Info("worker started")
	for job := range worker.jobChan {
		logrus.Info("Executing job " + job.Name())

		start := time.Now()
		job.Execute(worker.store, worker.configuration)

		logrus.WithFields(logrus.Fields{
			"elapsed": time.Since(start),
		}).Info("finished executing job" + job.Name())
	}
}

func (worker *Worker) TryEnqueue(job jobs.Job) bool {
	select {
	case worker.jobChan <- job:
		return true
	default:
		return false
	}
}
