package server

import (
	"github.com/uploadexpress/app/store/mongodb"
	"github.com/uploadexpress/app/worker"
)

func (a *API) SetupWorker() error {
	a.Worker = worker.NewWorker(mongodb.New(a.Database), a.Config)
	go a.Worker.Run()
	return nil
}
