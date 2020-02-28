/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import Account from '../../../models/Account';
import _Currency from '../../../models/Currency';

jest.mock('../../../models/Currency.ts', () => jest.fn());
const Currency = _Currency as jest.Mock;

describe('Account model test', () => {
  const currency = new Currency();

  it('should create Account object', () =>
    expect(
      new Account('vista', 'Account', 'Bank', 0, currency),
    ).not.toBeFalsy());

  it('should create debit Account that has correct attributes', () => {
    const acc = new Account('checking', 'Account', 'Bank', 0, currency);

    expect(acc.type).toBe('checking');
    expect(acc.name).toBe('Account');
    expect(acc.bank).toBe('Bank');
    expect(acc.initialBalance).toBe(0);
    expect(acc.currency).toBe(currency);
  });

  it('should create credit Account that has correct attributes', () => {
    const acc = new Account('credit', 'Account', 'Bank', 0, currency, 1, 20);

    expect(acc.type).toBe('credit');
    expect(acc.name).toBe('Account');
    expect(acc.bank).toBe('Bank');
    expect(acc.initialBalance).toBe(0);
    expect(acc.currency).toBe(currency);
    expect(acc.billingDay).toBe(1);
    expect(acc.paymentDay).toBe(20);
  });

  it('should not be instantiated if credit and no given billing or payment day', async () => {
    let error: any;

    try {
      (() => new Account('credit', 'Account', 'Bank', -10, currency))();
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeUndefined();
  });

  describe('validation', () => {
    it('should not pass validation if type cash and initialBalance < 0', async () =>
      expect(
        validateOrReject(new Account('cash', 'Account', 'Bank', -10, currency)),
      ).rejects.toBeTruthy());

    it('should not pass validation if type vista and initialBalance < 0', async () =>
      expect(
        validateOrReject(
          new Account('vista', 'Account', 'Bank', -10, currency),
        ),
      ).rejects.toBeTruthy());

    it('should pass validation if checking and initialBalance < 0', async () =>
      expect(
        await validateOrReject(
          new Account('checking', 'Account', 'Bank', -10, currency),
        ),
      ).toBeUndefined());

    it('should pass validation if credit and initialBalance < 0', async () =>
      expect(
        await validateOrReject(
          new Account('credit', 'Account', 'Bank', -10, currency, 1, 20),
        ),
      ).toBeUndefined());

    it('should pass validation if not credit and no given payment or billing days', async () =>
      expect(
        await validateOrReject(
          new Account('cash', 'Account', 'Bank', 0, currency),
        ),
      ).toBeUndefined());

    it('should not pass validation if no name', async () =>
      expect(
        validateOrReject(new Account('cash', '', 'Bank', 0, currency)),
      ).rejects.toBeTruthy());

    it('should not pass validation if no bank', async () =>
      expect(
        validateOrReject(new Account('cash', 'Account', '', 0, currency)),
      ).rejects.toBeTruthy());

    it('should not pass validation if credit and billingDay < 1', async () =>
      expect(
        validateOrReject(
          new Account('credit', 'Account', 'Bank', 0, currency, 0, 5),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if credit and billingDay > 30', async () =>
      expect(
        validateOrReject(
          new Account('credit', 'Account', 'Bank', 0, currency, 31, 5),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if credit and paymentDay < 1', async () =>
      expect(
        validateOrReject(
          new Account('credit', 'Account', 'Bank', 0, currency, 2, 0),
        ),
      ).rejects.toBeTruthy());

    it('should not pass validation if credit and paymentDay > 30', async () =>
      expect(
        validateOrReject(
          new Account('credit', 'Account', 'Bank', 0, currency, 2, 31),
        ),
      ).rejects.toBeTruthy());
  });
});
