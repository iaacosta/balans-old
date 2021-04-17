import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '../locales/en';
import { es } from '../locales/es';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: localStorage.getItem('locale') || 'en',
  resources: { en, es },
  debug: process.env.NODE_ENV !== 'production',
});

export default i18n;
