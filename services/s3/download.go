package s3

import (
	"context"
	"io"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/uploadexpress/app/config"
	"github.com/uploadexpress/app/models"
)

func GetObjectLink(c context.Context, uploadId string, file models.File) (string, error) {
	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(
			config.FromContext(c).GetString("aws_access_key_id"),
			config.FromContext(c).GetString("aws_secret_access_key"),
			"", // a token will be created when the session it's used.
		),
		Region: aws.String(config.FromContext(c).GetString("aws_region"))},
	)
	if err != nil {
		return "", err
	}

	// Create S3 service client
	svc := s3.New(sess)
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(config.FromContext(c).GetString("aws_bucket")),
		Key:    aws.String(uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
	})
	urlStr, err := req.Presign(time.Hour)
	if err != nil {
		return "", err
	}

	return urlStr, nil
}

func GetObjectReader(c context.Context, uploadId string, file models.File) (io.ReadCloser, error) {
	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(
			config.FromContext(c).GetString("aws_access_key_id"),
			config.FromContext(c).GetString("aws_secret_access_key"),
			"", // a token will be created when the session it's used.
		),
		Region: aws.String(config.FromContext(c).GetString("aws_region"))},
	)
	if err != nil {
		return nil, err
	}

	svc := s3.New(sess)
	reader, err := svc.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(config.FromContext(c).GetString("aws_bucket")),
		Key:    aws.String(uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
	})
	if err != nil {
		return nil, err
	}

	return reader.Body, nil
}
