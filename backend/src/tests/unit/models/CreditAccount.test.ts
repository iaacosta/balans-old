/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import CreditAccount from '../../../models/CreditAccount';
import * as CurrencyModel from '../../../models/Currency';

const Currency = ((CurrencyModel.default as any) = jest.fn());

describe('CreditAccount model test', () => {
  const currency = new Currency();

  it('should create CreditAccount object', () =>
    expect(
      new CreditAccount('Example Account', 'Example Bank', 0, currency, 1, 2),
    ).not.toBeFalsy());

  it('should create CreditAccount that has correct attributes', () => {
    const acc = new CreditAccount(
      'Example Account',
      'Example Bank',
      0,
      currency,
      1,
      2,
    );

    expect(acc.name).toBe('Example Account');
    expect(acc.bank).toBe('Example Bank');
    expect(acc.initialBalance).toBe(0);
    expect(acc.currency).toBe(currency);
    expect(acc.billingDay).toBe(1);
    expect(acc.paymentDay).toBe(2);
  });

  describe('validation', () => {
    it('should not pass validation if no name', async () =>
      expect(
        validateOrReject(
          new CreditAccount('', 'Example Bank', 0, currency, 2, 5),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if no bank', async () =>
      expect(
        validateOrReject(
          new CreditAccount('Example Account', '', 0, currency, 2, 5),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if billingDay < 1', async () =>
      expect(
        validateOrReject(
          new CreditAccount(
            'Example Account',
            'Example Bank',
            0,
            currency,
            0,
            5,
          ),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if billingDay > 30', async () =>
      expect(
        validateOrReject(
          new CreditAccount(
            'Example Account',
            'Example Bank',
            0,
            currency,
            31,
            5,
          ),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if paymentDay < 1', async () =>
      expect(
        validateOrReject(
          new CreditAccount(
            'Example Account',
            'Example Bank',
            0,
            currency,
            2,
            0,
          ),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if paymentDay > 30', async () =>
      expect(
        validateOrReject(
          new CreditAccount(
            'Example Account',
            'Example Bank',
            0,
            currency,
            2,
            31,
          ),
        ),
      ).rejects.toBeTruthy());
  });
});
