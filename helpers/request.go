package helpers

import (
	"encoding/json"
	"io"
	"io/ioutil"
)

func GetRequestParams(body io.ReadCloser) (map[string]interface{}, error) {
	byteBody, err := ioutil.ReadAll(body)
	if err != nil {
		return nil, err
	}

	var params map[string]interface{}
	err = json.Unmarshal(byteBody, &params)
	if err != nil {
		return nil, err
	}

	return params, nil
}
