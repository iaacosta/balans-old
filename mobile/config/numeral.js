import numeral from 'numeral';

numeral.register('locale', 'es', {
  delimiters: { decimal: ',', thousands: '.' },
  abbreviations: {
    thousand: 'k',
    million: 'M',
    billion: 'B',
    trillion: 'T',
  },
  currency: {
    symbol: '$',
  },
});

numeral.locale('es');
