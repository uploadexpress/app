package i18n

import (
	"context"

	"github.com/nicksnyder/go-i18n/v2/i18n"
)

const (
	storeKey = "i18n"
)

type Setter interface {
	Set(string, interface{})
}

func FromContext(c context.Context) *i18n.Bundle {
	return c.Value(storeKey).(*i18n.Bundle)
}

func ToContext(c Setter, worker *i18n.Bundle) {
	c.Set(storeKey, worker)
}

func Translate(c context.Context, to, key string, templateData map[string]interface{}) string {
	localizer := i18n.NewLocalizer(FromContext(c), to)
	translation, err := localizer.Localize(&i18n.LocalizeConfig{
		MessageID:    key,
		TemplateData: templateData,
	})

	if err != nil {
		return key
	}

	return translation
}
