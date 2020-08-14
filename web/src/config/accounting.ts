import accounting from 'accounting';

accounting.settings = {
  currency: {
    symbol: '$',
    format: {
      pos: '%s %v',
      neg: '%s (%v)',
      zero: '%s -',
    },
    decimal: ',',
    thousand: '.',
    precision: 0,
  },
  number: {},
};
