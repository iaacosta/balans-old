import Currency from '../../models/Currency';

describe('currency model test', () => {
  it('should create a currency object', () => {
    const currency = new Currency('Example currency');
    expect(currency).not.toBeFalsy();
  });
});
