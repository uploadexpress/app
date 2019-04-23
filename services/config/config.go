package config

import (
	"context"

	"github.com/spf13/viper"
)

type conf struct {
	*viper.Viper
}

func New(viper *viper.Viper) *conf {
	return &conf{viper}
}

func GetString(c context.Context, key string) string {
	return FromContext(c).GetString(key)
}

func GetBool(c context.Context, key string) bool {
	return FromContext(c).GetBool(key)
}

func GetInt(c context.Context, key string) int {
	return FromContext(c).GetInt(key)
}
