/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import { transactionModelFactory } from '../../factory/transactionFactory';

describe('Transaction model test', () => {
  it('should create Transaction object', () =>
    expect(transactionModelFactory(1, 0).transaction).not.toBeFalsy());

  it('should create Transaction that has correct attributes', () => {
    const { transaction, factoryTransaction } = transactionModelFactory(1, 0);
    expect(transaction.amount).toBe(factoryTransaction.amount);
    expect(transaction.accountId).toBe(1);
  });

  describe('validation', () => {
    it('should pass validation if everything is correct', async () => {
      await expect(
        validateOrReject(transactionModelFactory(1, 0)),
      ).resolves.toBeUndefined();
    });

    it('should not pass validation if amount is 0', async () => {
      const { transaction } = transactionModelFactory(1, 0, { amount: 0 });
      await expect(validateOrReject(transaction)).rejects.toBeTruthy();
    });
  });
});
