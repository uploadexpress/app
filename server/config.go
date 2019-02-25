package server

import (
	"github.com/joho/godotenv"
)

func (a *API) SetupConfig() error {
	filename := ".env"

	godotenv.Overload(filename)

	a.Config.SetEnvPrefix("ue")
	a.Config.AutomaticEnv()

	return nil
}
