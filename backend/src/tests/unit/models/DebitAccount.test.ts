/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import DebitAccount from '../../../models/DebitAccount';
import * as CurrencyModel from '../../../models/Currency';

const Currency = ((CurrencyModel.default as any) = jest.fn());

describe('DebitAccount model test', () => {
  const currency = new Currency();

  it('should create DebitAccount object', () =>
    expect(
      new DebitAccount('Example Account', 'Example Bank', 0, true, currency),
    ).not.toBeFalsy());

  it('should create DebitAccount that has correct attributes', () => {
    const acc = new DebitAccount(
      'Example Account',
      'Example Bank',
      0,
      true,
      currency,
    );

    expect(acc.name).toBe('Example Account');
    expect(acc.bank).toBe('Example Bank');
    expect(acc.initialBalance).toBe(0);
    expect(acc.allowsNegative).toBe(true);
    expect(acc.currency).toBe(currency);
  });

  describe('validation', () => {
    it('should not pass validation if !allowsNegative but initialBalance < 0', async () =>
      expect(
        validateOrReject(
          new DebitAccount(
            'Example Account',
            'Example Bank',
            -10,
            false,
            currency,
          ),
        ),
      ).rejects.toBeTruthy());

    it('should pass validation if allowsNegative and initialBalance < 0', async () =>
      expect(
        await validateOrReject(
          new DebitAccount(
            'Example Account',
            'Example Bank',
            -10,
            true,
            currency,
          ),
        ),
      ).toBeUndefined());

    it('should not pass validation if no name', async () =>
      expect(
        validateOrReject(
          new DebitAccount('', 'Example Bank', 0, true, currency),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if no bank', async () =>
      expect(
        validateOrReject(
          new DebitAccount('Example Account', '', 0, true, currency),
        ),
      ).rejects.toBeTruthy());
  });
});
