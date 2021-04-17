/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import {
  passiveModelFactory,
  passiveFactory,
} from '../../factory/passiveFactory';
import { accountModelFactory } from '../../factory/accountFactory';
import Passive from '../../../models/Passive';

jest.mock('../../../models/Account');

describe('Passive model test', () => {
  it('should create Passive object', () =>
    expect(
      passiveModelFactory({ account: accountModelFactory(1).account }).passive,
    ).not.toBeFalsy());

  it('should have undefined memo if one empty given', () => {
    const passive = new Passive({
      ...passiveFactory(),
      accountId: 1,
      memo: '',
    });

    expect(passive.memo).toBeUndefined();
  });

  it('should create Passive that has correct attributes', () => {
    const { account } = accountModelFactory(1);
    account.id = 1;

    const { passive, factoryPassive } = passiveModelFactory({
      account,
    });

    expect(passive.amount).toBe(factoryPassive.amount);
    expect(passive.accountId).toBe(1);
  });

  describe('validation', () => {
    it('should pass validation if everything is correct', async () => {
      await expect(
        validateOrReject(
          passiveModelFactory({ account: accountModelFactory(1).account }),
        ),
      ).resolves.toBeUndefined();
    });

    it('should not pass validation if amount is 0', async () => {
      const { passive } = passiveModelFactory(
        { account: accountModelFactory(1).account },
        { amount: 0 },
      );
      await expect(validateOrReject(passive)).rejects.toBeTruthy();
    });
  });
});
