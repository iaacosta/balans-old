/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import {
  transactionModelFactory,
  transactionFactory,
} from '../../factory/transactionFactory';
import { accountModelFactory } from '../../factory/accountFactory';
import Transaction from '../../../models/Transaction';

describe('Transaction model test', () => {
  it('should create Transaction object', () =>
    expect(
      transactionModelFactory(accountModelFactory(1).account).transaction,
    ).not.toBeFalsy());

  it('should have undefined memo if one empty given', () => {
    const transaction = new Transaction({
      ...transactionFactory(),
      accountId: 1,
      resultantBalance: 0,
      memo: '',
    });

    expect(transaction.memo).toBeUndefined();
  });

  it('should create Transaction that has correct attributes', () => {
    const { account } = accountModelFactory(1);
    account.id = 1;

    const { transaction, factoryTransaction } = transactionModelFactory(
      account,
    );

    expect(transaction.amount).toBe(factoryTransaction.amount);
    expect(transaction.accountId).toBe(1);
  });

  describe('validation', () => {
    it('should pass validation if everything is correct', async () => {
      await expect(
        validateOrReject(
          transactionModelFactory(accountModelFactory(1).account),
        ),
      ).resolves.toBeUndefined();
    });

    it('should not pass validation if amount is 0', async () => {
      const { transaction } = transactionModelFactory(
        accountModelFactory(1).account,
        { amount: 0 },
      );
      await expect(validateOrReject(transaction)).rejects.toBeTruthy();
    });
  });
});
