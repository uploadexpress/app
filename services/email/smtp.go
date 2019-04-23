package email

import (
	"bytes"
	"fmt"
	"html/template"
	"io/ioutil"

	"github.com/uploadexpress/app/helpers/params"
	gomail "gopkg.in/mail.v2"
)

type SmtpSender struct {
	dialer *gomail.Dialer
}

func NewSmtpSender(server string, port int, user, password string) *SmtpSender {
	return &SmtpSender{
		gomail.NewDialer(server, port, user, password),
	}
}

func (smtpSender *SmtpSender) SendEmail(from, name string, to []string, subject, templatePath string, params params.M) error {
	// load template
	file, err := ioutil.ReadFile(fmt.Sprintf("templates/%s.html", templatePath))
	if err != nil {
		return err
	}

	htmlTemplate := template.Must(template.New("emailTemplate").Parse(string(file)))

	// variable interpolation
	buffer := new(bytes.Buffer)
	err = htmlTemplate.Execute(buffer, params)
	if err != nil {
		return err
	}

	m := gomail.NewMessage()
	m.SetAddressHeader("From", from, name)
	m.SetHeader("Bcc", to...)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", buffer.String())

	if err := smtpSender.dialer.DialAndSend(m); err != nil {
		return err
	}

	return nil
}
