import { Currency } from '../@types/graphql';

export default {
  [Currency.Clp]: {
    symbol: 'CLP$',
    decimalSeparator: ',',
    thousandSeparator: '.',
    decimalPlaces: 0,
  },
  [Currency.Usd]: {
    symbol: 'USD$',
    decimalSeparator: '.',
    thousandSeparator: ',',
    decimalPlaces: 2,
  },
};
