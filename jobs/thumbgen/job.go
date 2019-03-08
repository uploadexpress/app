package thumbgen

import (
	"bytes"
	"fmt"
	"image"
	jpgImage "image/jpeg"
	pngImage "image/png"
	"io/ioutil"

	"github.com/Sirupsen/logrus"
	"github.com/disintegration/imaging"
	"github.com/h2non/filetype"
	"github.com/h2non/filetype/matchers"
	"github.com/spf13/viper"
	"github.com/uploadexpress/app/config"
	"github.com/uploadexpress/app/helpers/params"
	"github.com/uploadexpress/app/models"
	"github.com/uploadexpress/app/services/s3"
	"github.com/uploadexpress/app/store"
)

var SupportedThumbnailTypes = matchers.Map{
	matchers.TypeJpeg: matchers.Jpeg,
	matchers.TypePng:  matchers.Png,
}

type ThumbnailGenerator struct {
	params params.M
}

func NewThumbnailGenerator(params params.M) *ThumbnailGenerator {
	return &ThumbnailGenerator{
		params,
	}
}

func (tg ThumbnailGenerator) Name() string {
	return "thumbnail_generator"
}

func (tg ThumbnailGenerator) Execute(store store.Store, configuration *viper.Viper) {
	file := tg.params["file"].(models.File)
	uploadId := tg.params["uploadId"].(string)

	awsConfig := config.NewAwsConfigurationFromConfig(configuration)

	reader, err := s3.GetObjectHeader(awsConfig, uploadId, file)
	if err != nil {
		logrus.Error("could not fetch the header for file" + file.Id)
	}

	fileHeader, err := ioutil.ReadAll(reader)
	if err != nil {
		logrus.Error("could not read the header for file" + file.Id)
	}

	if filetype.MatchesMap(fileHeader, SupportedThumbnailTypes) {
		match := filetype.MatchMap(fileHeader, SupportedThumbnailTypes)

		s3image, err := s3.GetObjectReader(awsConfig, uploadId, file)
		if err != nil {
			logrus.Error("could not fetch the image " + file.Name)
		}

		var img image.Image
		switch match {
		case matchers.TypeJpeg:
			img, err = jpgImage.Decode(s3image)
			break
		case matchers.TypePng:
			img, err = pngImage.Decode(s3image)
			break
		}
		if err != nil {
			logrus.Error("could not decode the image")
		}

		dstImage256 := imaging.Resize(img, 256, 0, imaging.Lanczos)

		buff := new(bytes.Buffer)
		err = pngImage.Encode(buff, dstImage256)
		if err != nil {
			fmt.Println("failed to create buffer", err)
		}
		reader := bytes.NewReader(buff.Bytes())

		url, err := s3.PutPublicObject(awsConfig, fmt.Sprintf("%s/%s/preview.png", uploadId, file.Id), ioutil.NopCloser(reader))

		err = store.AttachPreview(uploadId, file.Id, url, dstImage256.Rect.Max.X, dstImage256.Rect.Max.Y)
		if err != nil {
			logrus.Error(err.Error())
		}
	}
}
