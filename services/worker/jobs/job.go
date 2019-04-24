package jobs

import (
	"github.com/spf13/viper"
	"github.com/uploadexpress/app/store"
)

type Job interface {
	Name() string
	Execute(store.Store, *viper.Viper)
}
