/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import { accountModelFactory } from '../../factory/accountFactory';
import { AccountType } from '../../../graphql/helpers';

describe('Account model test', () => {
  it('should create Account object', () =>
    expect(accountModelFactory(1).account).not.toBeFalsy());

  it('should create Account that has correct attributes', () => {
    const { account, factoryAccount } = accountModelFactory(1);
    expect(account.name).toBe(factoryAccount.name);
    expect(account.bank).toBe(factoryAccount.bank);
    expect(account.type).toBe(factoryAccount.type);
    expect(account.balance).toBe(factoryAccount.initialBalance);
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
      const { account } = accountModelFactory(1, {
        type: AccountType.cash,
        initialBalance: -1000,
      });
      await expect(validateOrReject(account)).rejects.toBeTruthy();
    });

    it('should not pass validation if balance < 0 an type is vista', async () => {
      const { account } = accountModelFactory(1, {
        type: AccountType.vista,
        initialBalance: -1000,
      });
      await expect(validateOrReject(account)).rejects.toBeTruthy();
    });

    it('should pass validation if balance > 0 an type is cash', async () => {
      const { account } = accountModelFactory(1, {
        type: AccountType.cash,
        initialBalance: 1000,
      });
      await expect(validateOrReject(account)).resolves.toBeUndefined();
    });

    it('should pass validation if balance > 0 an type is vista', async () => {
      const { account } = accountModelFactory(1, {
        type: AccountType.vista,
        initialBalance: 1000,
      });
      await expect(validateOrReject(account)).resolves.toBeUndefined();
    });

    it('should pass validation if balance > 0 an type is checking', async () => {
      const { account } = accountModelFactory(1, {
        type: AccountType.checking,
        initialBalance: 1000,
      });
      await expect(validateOrReject(account)).resolves.toBeUndefined();
    });

    it('should pass validation if balance < 0 an type is checking', async () => {
      const { account } = accountModelFactory(1, {
        type: AccountType.checking,
        initialBalance: -1000,
      });
      await expect(validateOrReject(account)).resolves.toBeUndefined();
    });
  });
});
