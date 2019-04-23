package server

import (
	"github.com/uploadexpress/app/services/worker"
	"github.com/uploadexpress/app/store/mongodb"
)

func (a *API) SetupWorker() error {
	a.Worker = worker.NewWorker(mongodb.New(a.Database), a.Config)
	go a.Worker.Run()
	return nil
}
