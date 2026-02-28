import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ro from '@/locales/ro/common.json';
import en from '@/locales/en/common.json';

const resources = {
  ro: { translation: ro },
  en: { translation: en },
};

// Always start with 'ro' so server and client initial renders match (prevents hydration error #418).
// The stored language preference is restored after hydration in Providers.
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ro',
    fallbackLng: 'ro',
    interpolation: { escapeValue: false },
  });

export default i18n;
