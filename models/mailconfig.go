package models

type MailConfig struct {
	RecipientEmails []string `json:"recipient_emails,omitempty" bson:"recipient_emails,omitempty"`
	SenderEmail     string   `json:"sender_email,omitempty" bson:"sender_email,omitempty"`
	Message         string   `json:"message,omitempty" bson:"message,omitempty"`
	Language        string   `json:"language" bson:"language"`
}
