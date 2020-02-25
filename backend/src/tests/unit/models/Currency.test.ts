import Currency from '../../../models/Currency';

describe('Currency model test', () => {
  const defaultCurrency = () => new Currency('Example Currency');

  it('should create Currency object', () =>
    expect(defaultCurrency()).not.toBeFalsy());

  it('should create Currency that has correct attributes', () => {
    const currency = defaultCurrency();
    expect(currency.name).toBe('Example Currency');
  });
});
