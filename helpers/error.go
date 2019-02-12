package helpers

import (
	"fmt"
)

type Error struct {
	Code     string `json:"code"`
	Message  string `json:"message"`
	Trace    error  `json:"trace"`
	HttpCode int    `json:"-"`
}


func (e Error) Error() string {
	return fmt.Sprintf("%v: %v", e.Code, e.Message)
}

func (e Error) ErrorTrace() error {
	return e.Trace
}

func ErrorWithCode(code string, message string, trace error) Error {
	return Error{Code: code, Message: message, Trace: trace}
}

func NewError(httpCode int, code string, message string, trace error) Error {
	return Error{Code: code, Message: message, HttpCode: httpCode, Trace: trace}
}

func NewErrorWithTrace(httpCode int, code string, message string, trace error) Error {
	return Error{Code: code, Message: message, HttpCode: httpCode, Trace: trace}
}
