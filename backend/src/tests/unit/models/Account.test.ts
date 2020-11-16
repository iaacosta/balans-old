/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import { accountModelFactory } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';
import Account from '../../../models/Account';

describe('Account model test', () => {
  it('should create Account object', () =>
    expect(accountModelFactory(1).account).not.toBeFalsy());

  it('should create Account that has correct attributes', () => {
    const { account, factoryAccount } = accountModelFactory(1);
    expect(account.name).toBe(factoryAccount.name);
    expect(account.bank).toBe(factoryAccount.bank);
    expect(account.type).toBe(factoryAccount.type);
    expect(account.balance).not.toBe(factoryAccount.initialBalance);
    expect(account.balance).toBe(0);
  });

  describe('validation', () => {
    it('should pass validation if everything is correct', async () => {
      await expect(
        validateOrReject(accountModelFactory(1)),
      ).resolves.toBeUndefined();
    });

    it('should not pass validation if name is empty', async () => {
      const { account } = accountModelFactory(1, { name: '' });
      await expect(validateOrReject(account)).rejects.toBeTruthy();
    });

    it('should not pass validation if bank is empty', async () => {
      const { account } = accountModelFactory(1, { bank: '' });
      await expect(validateOrReject(account)).rejects.toBeTruthy();
    });

    it('should not pass validation if balance < 0 an type is cash', async () => {
      const { account } = accountModelFactory(1, { type: AccountType.cash });
      account.balance = -1000;
      await expect(validateOrReject(account)).rejects.toBeTruthy();
    });

    it('should not pass validation if balance < 0 an type is vista', async () => {
      const { account } = accountModelFactory(1, { type: AccountType.vista });
      account.balance = -1000;
      await expect(validateOrReject(account)).rejects.toBeTruthy();
    });

    it('should pass validation if balance > 0 an type is cash', async () => {
      const { account } = accountModelFactory(1, { type: AccountType.cash });
      account.balance = 1000;
      await expect(validateOrReject(account)).resolves.toBeUndefined();
    });

    it('should pass validation if balance > 0 an type is vista', async () => {
      const { account } = accountModelFactory(1, { type: AccountType.vista });
      account.balance = 1000;
      await expect(validateOrReject(account)).resolves.toBeUndefined();
    });

    it('should pass validation if balance > 0 an type is checking', async () => {
      const { account } = accountModelFactory(1, {
        type: AccountType.checking,
      });
      account.balance = 1000;
      await expect(validateOrReject(account)).resolves.toBeUndefined();
    });

    it('should pass validation if balance < 0 an type is checking', async () => {
      const { account } = accountModelFactory(1, {
        type: AccountType.checking,
      });
      account.balance = -1000;
      await expect(validateOrReject(account)).resolves.toBeUndefined();
    });
  });

  describe('static', () => {
    describe('applyBalanceChanges', () => {
      it('should apply balance changes', () => {
        const testFrom = { balance: 0 } as Account;
        const testTo = { balance: 0 } as Account;
        const testAmount = 1000;

        Account.applyBalanceChanges({
          amount: testAmount,
          from: testFrom,
          to: testTo,
        });

        expect(testFrom.balance).toBe(-testAmount);
        expect(testTo.balance).toBe(testAmount);
      });
    });
  });
});
