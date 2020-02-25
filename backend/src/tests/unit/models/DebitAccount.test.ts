import DebitAccount from '../../../models/DebitAccount';

class Currency {}

describe('DebitAccount model test', () => {
  const currency: any = new Currency();

  const defaultAccount = () =>
    new DebitAccount('Example Account', 'Example Bank', 0, true, currency);

  it('should create DebitAccount object', () =>
    expect(defaultAccount()).not.toBeFalsy());

  it('should create DebitAccount that has correct attributes', () => {
    const acc = defaultAccount();

    expect(acc.name).toBe('Example Account');
    expect(acc.bank).toBe('Example Bank');
    expect(acc.initialBalance).toBe(0);
    expect(acc.allowsNegative).toBe(true);
    expect(acc.currency).toBe(currency);
  });
});
