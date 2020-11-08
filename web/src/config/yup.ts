/* eslint-disable no-template-curly-in-string */
import { setLocale } from 'yup';
import { longDateFormatter } from '../utils/date';

setLocale({
  mixed: { required: 'This field is required' },
  string: { email: 'Invalid email', min: 'Must be at least ${min} characters long' },
  number: { min: ({ min }) => `Must be greater than ${min - 1}` },
  date: { max: ({ max }) => `Must be earlier than ${longDateFormatter(max)}` },
});
