package server

import (
	"github.com/joho/godotenv"
)

func (a *API) SetupConfig() error {
	filename := ".env"
	err := godotenv.Overload(filename)
	if err != nil {
		return err
	}

	a.Config.AutomaticEnv()

	return nil
}
