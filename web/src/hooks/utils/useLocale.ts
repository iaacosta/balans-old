import { Callback } from 'i18next';
import { useTranslation, UseTranslationOptions } from 'react-i18next';
import { Locale, LocaleKeys } from '../../@types/locales';

type UseLocaleReturn = {
  locale: (key: LocaleKeys) => string;
  changeLocale: (language: Locale, callback?: Callback) => void;
} & Omit<ReturnType<typeof useTranslation>, 't'>;

export const useLocale = (options?: UseTranslationOptions): UseLocaleReturn => {
  const { t, i18n, ...other } = useTranslation(undefined, options);

  const changeLocale: UseLocaleReturn['changeLocale'] = async (language, callback) => {
    localStorage.setItem('locale', language);
    await i18n.changeLanguage(language, callback);
  };

  return { locale: t, changeLocale, i18n, ...other };
};
