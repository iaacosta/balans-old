import CreditAccount from '../../../models/CreditAccount';

class Currency {}

describe('CreditAccount model test', () => {
  const currency: any = new Currency();

  const defaultAccount = () =>
    new CreditAccount('Example Account', 'Example Bank', 0, currency, 1, 2);

  it('should create CreditAccount object', () =>
    expect(defaultAccount()).not.toBeFalsy());

  it('should create CreditAccount that has correct attributes', () => {
    const acc = defaultAccount();

    expect(acc.name).toBe('Example Account');
    expect(acc.bank).toBe('Example Bank');
    expect(acc.initialBalance).toBe(0);
    expect(acc.currency).toBe(currency);
    expect(acc.billingDay).toBe(1);
    expect(acc.paymentDay).toBe(2);
  });
});
