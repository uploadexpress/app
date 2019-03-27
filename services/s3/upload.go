package s3

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"net/url"
	"time"

	"github.com/sirupsen/logrus"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/uploadexpress/app/config"
	"github.com/uploadexpress/app/models"
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

	return fmt.Sprintf("%s/%s/%s", configuration.Endpoint, configuration.Bucket, key), nil
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

func RemoveUpload(configuration config.AwsConfiguration, upload *models.Upload) error {
	if upload == nil || upload.Id == "" {
		return fmt.Errorf("the upload does not exist")
	}

	err := RemoveDirectory(configuration, fmt.Sprintf("%s/", upload.Id))
	if err != nil {
		return err
	}

	err = RemoveDirectory(configuration, fmt.Sprintf("backgrounds/%s/", upload.Id))
	if err != nil {
		logrus.Warn("the upload did not have any backgrounds")
	}

	err = RemoveDirectory(configuration, fmt.Sprintf("previews/%s/", upload.Id))
	if err != nil {
		logrus.Warn("the upload did not have any preview")
	}

	return nil
}

func RemoveDirectory(configuration config.AwsConfiguration, key string) error {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return err
	}

	svc := s3.New(sess)
	output, err := svc.ListObjects(&s3.ListObjectsInput{
		Bucket: aws.String(configuration.Bucket),
		Prefix: aws.String(key),
	})
	if err != nil {
		return err
	}

	// divide in chunks of 30 (per aws doc)
	var divided [][]*s3.Object
	chunkSize := 30
	for i := 0; i < len(output.Contents); i += chunkSize {
		end := i + chunkSize

		if end > len(output.Contents) {
			end = len(output.Contents)
		}

		divided = append(divided, output.Contents[i:end])
	}

	// delete all the chunks!
	for _, chunk := range divided {
		var objects []*s3.ObjectIdentifier
		for _, key := range chunk {
			objects = append(objects, &s3.ObjectIdentifier{
				Key: key.Key,
			})
		}

		_, err = svc.DeleteObjects(&s3.DeleteObjectsInput{
			Bucket: aws.String(configuration.Bucket),
			Delete: &s3.Delete{
				Objects: objects,
			},
		})
		if err != nil {
			logrus.Error("could not delete chunk")
		}
	}

	return nil
}
