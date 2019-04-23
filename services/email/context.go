package email

import (
	"context"

	"github.com/uploadexpress/app/helpers/params"
)

const (
	storeKey = "email"
)

type Setter interface {
	Set(string, interface{})
}

func FromContext(c context.Context) EmailSender {
	return c.Value(storeKey).(EmailSender)
}

func ToContext(c Setter, worker EmailSender) {
	c.Set(storeKey, worker)
}

func SendEmail(c context.Context, from, name string, to []string, subject, template string, params params.M) error {
	return FromContext(c).SendEmail(from, name, to, subject, template, params)
}
