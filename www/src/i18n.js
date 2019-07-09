import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';

const fallbackLng = ['en'];
export const availableLanguages = ['en', 'ru', 'fr', 'zh-TW', 'ja'];

// Import necessary locales
availableLanguages.forEach((element) => {
  if (element !== 'en') {
    import(`moment/locale/${element}`);
  }
});

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng,
    debug: true,
    whitelist: availableLanguages,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: (value, format, lng) => {
        if (format === 'expiration') return moment.unix(value).locale(lng).fromNow();
        return value;
      },
    },
  });

export default i18n;
