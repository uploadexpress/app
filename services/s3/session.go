package s3

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/uploadexpress/app/services/config"
)

func CreateAwsSession(configuration config.AwsConfiguration) (*session.Session, error) {
	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(
			configuration.AccessKey,
			configuration.SecretKey,
			"", // a token will be created when the session it's used.
		),
		Region:           aws.String(configuration.Region),
		Endpoint:         aws.String(configuration.Endpoint),
		S3ForcePathStyle: aws.Bool(true),
	})
	if err != nil {
		return nil, err
	}

	return sess, nil
}
