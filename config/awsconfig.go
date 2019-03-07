package config

import (
	"context"

	"github.com/spf13/viper"
)

type AwsConfiguration struct {
	AccessKey string
	SecretKey string
	Region    string
	Bucket    string
}

func NewAwsConfigurationFromConfig(config *viper.Viper) AwsConfiguration {
	return AwsConfiguration{
		config.GetString("aws_access_key_id"),
		config.GetString("aws_secret_access_key"),
		config.GetString("aws_region"),
		config.GetString("aws_bucket"),
	}
}

func NewAwsConfigurationFromContext(c context.Context) AwsConfiguration {
	return AwsConfiguration{
		FromContext(c).GetString("aws_access_key_id"),
		FromContext(c).GetString("aws_secret_access_key"),
		FromContext(c).GetString("aws_region"),
		FromContext(c).GetString("aws_bucket"),
	}
}
