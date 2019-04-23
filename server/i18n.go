package server

import (
	"fmt"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
)

var AvailableLanguages = []string{"en", "fr", "ru"}

func (a *API) SetupI18n() error {
	a.I18n = &i18n.Bundle{
		DefaultLanguage: language.English,
	}

	for _, currLanguage := range AvailableLanguages {
		file, err := a.I18n.LoadMessageFile(fmt.Sprintf("front/locales/%s/translation.json", currLanguage))
		if err != nil {
			return err
		}

		lang, err := language.Parse(currLanguage)
		if err != nil {
			return err
		}

		err = a.I18n.AddMessages(lang, file.Messages...)
		if err != nil {
			return err
		}
	}

	return nil
}
