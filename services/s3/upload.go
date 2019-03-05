package s3

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"net/url"
	"time"

	"github.com/uploadexpress/app/models"

	"github.com/uploadexpress/app/config"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func CreatePutObjectPreSignedUrl(c context.Context, uploadId string, file models.File) (string, error) {
	awsAccess := config.FromContext(c).GetString("aws_access_key_id")
	awsSecret := config.FromContext(c).GetString("aws_secret_access_key")
	awsRegion := config.FromContext(c).GetString("aws_region")
	awsBucket := config.FromContext(c).GetString("aws_bucket")

	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(
			awsAccess,
			awsSecret,
			"", // a token will be created when the session it's used.
		),
		Region: aws.String(awsRegion)},
	)
	if err != nil {
		return "", err
	}

	svc := s3.New(sess)
	req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(awsBucket),
		Key:    aws.String(uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
	})
	str, err := req.Presign(time.Hour)
	if err != nil {
		return "", err
	}

	return str, nil
}

func PutPublicObject(c context.Context, key string, reader io.ReadCloser) (string, error) {
	awsAccess := config.FromContext(c).GetString("aws_access_key_id")
	awsSecret := config.FromContext(c).GetString("aws_secret_access_key")
	awsRegion := config.FromContext(c).GetString("aws_region")
	awsBucket := config.FromContext(c).GetString("aws_bucket")

	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(
			awsAccess,
			awsSecret,
			"", // a token will be created when the session it's used.
		),
		Region: aws.String(awsRegion)},
	)
	if err != nil {
		return "", err
	}

	data, err := ioutil.ReadAll(reader)
	if err != nil {
		return "", err
	}

	svc := s3.New(sess)
	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(awsBucket),
		Key:    aws.String(key),
		Body:   bytes.NewReader(data),
		ACL:    aws.String("public-read"),
	})
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("https://s3-%s.amazonaws.com/%s/%s", awsRegion, awsBucket, key), nil
}

func RemoveObject(c context.Context, key string) error {
	awsAccess := config.FromContext(c).GetString("aws_access_key_id")
	awsSecret := config.FromContext(c).GetString("aws_secret_access_key")
	awsRegion := config.FromContext(c).GetString("aws_region")
	awsBucket := config.FromContext(c).GetString("aws_bucket")

	sess, err := session.NewSession(&aws.Config{
		Credentials: credentials.NewStaticCredentials(
			awsAccess,
			awsSecret,
			"", // a token will be created when the session it's used.
		),
		Region: aws.String(awsRegion)},
	)
	if err != nil {
		return err
	}

	svc := s3.New(sess)
	_, err = svc.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(awsBucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return err
	}

	return nil
}
