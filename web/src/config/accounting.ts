import accounting from 'accounting';

accounting.settings = {
  currency: {
    format: {
      pos: '%s %v',
      neg: '%s (%v)',
      zero: '%s %v',
    },
  },
  number: {},
};
