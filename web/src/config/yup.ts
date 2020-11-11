import { setLocale } from 'yup';
import { longDateFormatter } from '../utils/date';
import i18n from './i18n';

setLocale({
  mixed: { required: () => i18n.t('validation:mixed:required') },
  string: {
    email: () => i18n.t('validation:string:email'),
    min: ({ min }) => i18n.t('validation:string:min', { value: min }),
  },
  number: { min: ({ min }) => i18n.t('validation:number:min', { value: min - 1 }) },
  date: { max: ({ max }) => i18n.t('validation:date:max', { value: longDateFormatter(max) }) },
});
