package s3

import (
	"fmt"
	"io"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go/service/s3/s3manager"

	"github.com/sirupsen/logrus"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/services/config"
)

func CreatePutObjectPreSignedUrl(configuration config.AwsConfiguration, uploadId string, file models.File) (string, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return "", err

	}

	svc := s3.New(sess)
	req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(configuration.Bucket),
		Key:    aws.String("uploads/" + uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
	})
	str, err := req.Presign(time.Hour)
	if err != nil {
		return "", err
	}

	return str, nil
}

func CreateUploadPartPreSignedUrl(configuration config.AwsConfiguration, uploadId string, file models.File, partNumber int64, s3UploadId string) (string, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return "", err

	}

	svc := s3.New(sess)
	req, _ := svc.UploadPartRequest(&s3.UploadPartInput{
		Bucket:     aws.String(configuration.Bucket),
		Key:        aws.String("uploads/" + uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
		PartNumber: aws.Int64(partNumber),
		UploadId:   aws.String(s3UploadId),
	})
	str, err := req.Presign(time.Hour)
	if err != nil {
		return "", err
	}

	return str, nil
}

func CreateMultipartUpload(configuration config.AwsConfiguration, uploadId string, file models.File) (string, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return "", err
	}

	svc := s3.New(sess)
	output, _ := svc.CreateMultipartUpload(&s3.CreateMultipartUploadInput{
		Bucket: aws.String(configuration.Bucket),
		Key:    aws.String("uploads/" + uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
	})
	if err != nil {
		return "", err
	}

	return *output.UploadId, nil
}

func CompleteMultipartUpload(configuration config.AwsConfiguration, uploadId string, file models.File, s3UploadId string, parts []FilePart) error {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return err
	}

	var s3Parts []*s3.CompletedPart
	for _, part := range parts {
		s3Parts = append(s3Parts, &s3.CompletedPart{
			ETag:       aws.String(part.ETag),
			PartNumber: aws.Int64(part.PartNumber),
		})
	}

	svc := s3.New(sess)
	_, err = svc.CompleteMultipartUpload(&s3.CompleteMultipartUploadInput{
		Bucket:   aws.String(configuration.Bucket),
		Key:      aws.String("uploads/" + uploadId + "/" + file.Id + "/" + url.PathEscape(file.Name)),
		UploadId: aws.String(s3UploadId),
		MultipartUpload: &s3.CompletedMultipartUpload{
			Parts: s3Parts,
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func PutObject(configuration config.AwsConfiguration, key string, reader io.Reader, public bool) (string, error) {
	sess, err := CreateAwsSession(configuration)
	if err != nil {
		return "", err
	}

	var ACL *string
	if public {
		ACL = aws.String("public-read")
	}

	svc := s3.New(sess)
	uploader := s3manager.NewUploaderWithClient(svc)
	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(configuration.Bucket),
		Key:    aws.String(key),
		Body:   reader,
		ACL:    ACL,
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

	err := RemoveDirectory(configuration, fmt.Sprintf("uploads/%s/", upload.Id))
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
