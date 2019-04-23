package email

import "github.com/uploadexpress/app/helpers/params"

type EmailSender interface {
	SendEmail(from, name string, to []string, subject, template string, params params.M) error
}
