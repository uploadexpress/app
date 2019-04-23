package s3

import (
	"io"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/services/config"
)

func GetObjectLink(configuration config.AwsConfiguration, uploadId string, file models.File) (string, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return "", err
	}

	// Create S3 service client
	svc := s3.New(sess)
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket:                     aws.String(configuration.Bucket),
		Key:                        aws.String("uploads/" + uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
		ResponseContentDisposition: aws.String("attachment; filename =\"" + file.Name + "\""),
	})
	urlStr, err := req.Presign(time.Hour)
	if err != nil {
		return "", err
	}

	return urlStr, nil
}

func GetObjectReader(configuration config.AwsConfiguration, uploadId string, file models.File) (io.ReadCloser, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return nil, err
	}

	svc := s3.New(sess)
	reader, err := svc.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(configuration.Bucket),
		Key:    aws.String("uploads/" + uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
	})
	if err != nil {
		return nil, err
	}

	return reader.Body, nil
}

func GetObjectHeader(configuration config.AwsConfiguration, uploadId string, file models.File) (io.ReadCloser, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return nil, err
	}

	svc := s3.New(sess)
	reader, err := svc.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(configuration.Bucket),
		Key:    aws.String("uploads/" + uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
		Range:  aws.String("bytes=0-261"),
	})
	if err != nil {
		return nil, err
	}

	return reader.Body, nil
}
