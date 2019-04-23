package server

import "github.com/uploadexpress/app/services/email"

func (a *API) SetupMailer() error {
	a.Mailer = email.NewSmtpSender(
		a.Config.GetString("mail_host"),
		a.Config.GetInt("mail_port"),
		a.Config.GetString("mail_user"),
		a.Config.GetString("mail_password"),
	)

	return nil
}
