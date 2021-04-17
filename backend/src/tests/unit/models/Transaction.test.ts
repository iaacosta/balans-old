/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import {
  transactionModelFactory,
  transactionFactory,
} from '../../factory/transactionFactory';
import { accountModelFactory } from '../../factory/accountFactory';
import Transaction from '../../../models/Transaction';
import { categoryModelFactory } from '../../factory/categoryFactory';
import { CategoryType } from '../../../graphql/helpers';

describe('Transaction model test', () => {
  it('should create Transaction object', () =>
    expect(
      transactionModelFactory({ account: accountModelFactory(1).account })
        .transaction,
    ).not.toBeFalsy());

  it('should have undefined memo if one empty given', () => {
    const transaction = new Transaction({
      ...transactionFactory(),
      accountId: 1,
      memo: '',
    });

    expect(transaction.memo).toBeUndefined();
  });

  it('should create Transaction that has correct attributes', () => {
    const { account } = accountModelFactory(1);
    account.id = 1;

    const { transaction, factoryTransaction } = transactionModelFactory({
      account,
    });

    expect(transaction.amount).toBe(factoryTransaction.amount);
    expect(transaction.accountId).toBe(1);
  });

  describe('validation', () => {
    it('should pass validation if everything is correct', async () => {
      await expect(
        validateOrReject(
          transactionModelFactory({ account: accountModelFactory(1).account }),
        ),
      ).resolves.toBeUndefined();
    });

    it('should not pass validation if amount is 0', async () => {
      const { transaction } = transactionModelFactory(
        { account: accountModelFactory(1).account },
        { amount: 0 },
      );
      await expect(validateOrReject(transaction)).rejects.toBeTruthy();
    });

    it('should not pass validation if category is expense and amount is income', async () => {
      const { transaction } = transactionModelFactory(
        { account: accountModelFactory(1).account },
        { amount: 1000 },
      );

      transaction.category = categoryModelFactory(1, {
        type: CategoryType.expense,
      }).category;

      await expect(validateOrReject(transaction)).rejects.toBeTruthy();
    });

    it('should not pass validation if category is expense and amount is income', async () => {
      const { transaction } = transactionModelFactory(
        { account: accountModelFactory(1).account },
        { amount: -1000 },
      );

      transaction.category = categoryModelFactory(1, {
        type: CategoryType.income,
      }).category;

      await expect(validateOrReject(transaction)).rejects.toBeTruthy();
    });
  });
});
