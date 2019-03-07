package s3

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"net/url"
	"time"

	"github.com/uploadexpress/app/models"

	"github.com/uploadexpress/app/config"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
)

func CreatePutObjectPreSignedUrl(configuration config.AwsConfiguration, uploadId string, file models.File) (string, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return "", err

	}

	svc := s3.New(sess)
	req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(configuration.Bucket),
		Key:    aws.String(uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
	})
	str, err := req.Presign(time.Hour)
	if err != nil {
		return "", err
	}

	return str, nil
}

func PutPublicObject(configuration config.AwsConfiguration, key string, reader io.ReadCloser) (string, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return "", err
	}

	data, err := ioutil.ReadAll(reader)
	if err != nil {
		return "", err
	}

	svc := s3.New(sess)
	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(configuration.Bucket),
		Key:    aws.String(key),
		Body:   bytes.NewReader(data),
		ACL:    aws.String("public-read"),
	})
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("https://s3-%s.amazonaws.com/%s/%s", configuration.Region, configuration.Bucket, key), nil
}

func RemoveObject(configuration config.AwsConfiguration, key string) error {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return err
	}

	svc := s3.New(sess)
	_, err = svc.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(configuration.Bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return err
	}

	return nil
}
