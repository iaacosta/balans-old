/* eslint-disable no-template-curly-in-string */
import { setLocale } from 'yup';

setLocale({
  mixed: { required: 'This field is required' },
  string: { email: 'Invalid email', min: 'Must be at least ${min} characters long' },
  number: { min: ({ min }) => `Must be greater than ${min - 1}` },
});
