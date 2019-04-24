package config

import (
	"context"

	"github.com/spf13/viper"
)

type AwsConfiguration struct {
	AccessKey string
	SecretKey string
	Endpoint  string
	Region    string
	Bucket    string
}

func NewAwsConfigurationFromConfig(config *viper.Viper) AwsConfiguration {
	return AwsConfiguration{
		config.GetString("s3_access_key_id"),
		config.GetString("s3_secret_access_key"),
		config.GetString("s3_endpoint"),
		config.GetString("s3_region"),
		config.GetString("s3_bucket"),
	}
}

func NewAwsConfigurationFromContext(c context.Context) AwsConfiguration {
	return AwsConfiguration{
		FromContext(c).GetString("s3_access_key_id"),
		FromContext(c).GetString("s3_secret_access_key"),
		FromContext(c).GetString("s3_endpoint"),
		FromContext(c).GetString("s3_region"),
		FromContext(c).GetString("s3_bucket"),
	}
}
