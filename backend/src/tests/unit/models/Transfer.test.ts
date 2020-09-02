/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

/*
  NOTE: this line prevents a circular dependency from generating.
  I have no clue why it works, but since it's a minor issue, I'm
  not putting resources into investigating it.
*/
import '../../factory/transactionFactory';

import {
  transferModelFactory,
  transferFactory,
} from '../../factory/transferFactory';
import { accountModelFactory } from '../../factory/accountFactory';
import Transfer from '../../../models/Transfer';

describe('Transfer model test', () => {
  const customTransferFactory = (
    overrides?: Partial<{ amount: number; memo: string }>,
  ) => {
    const { account: fromAccount } = accountModelFactory(1);
    const { account: toAccount } = accountModelFactory(1);
    fromAccount.id = 1;
    toAccount.id = 2;
    return transferModelFactory({ fromAccount, toAccount }, overrides);
  };

  it('should create Transfer object', () =>
    expect(
      transferModelFactory({
        fromAccount: accountModelFactory(1).account,
        toAccount: accountModelFactory(2).account,
      }).fromTransfer,
    ).not.toBeFalsy());

  it('should have undefined memo if one empty given', () => {
    const transfer = new Transfer({
      ...transferFactory(),
      accountId: 1,
      memo: '',
    });

    expect(transfer.memo).toBeUndefined();
  });

  it('should create Transfer that has correct attributes', () => {
    const {
      fromTransfer,
      toTransfer,
      factoryTransfer,
    } = customTransferFactory();

    expect(fromTransfer.amount).toBe(-factoryTransfer.amount);
    expect(fromTransfer.accountId).toBe(1);
    expect(toTransfer.amount).toBe(factoryTransfer.amount);
    expect(toTransfer.accountId).toBe(2);
  });

  describe('validation', () => {
    it('should pass validation if everything is correct', async () => {
      const { fromTransfer, toTransfer } = customTransferFactory();
      await expect(validateOrReject(fromTransfer)).resolves.toBeUndefined();
      await expect(validateOrReject(toTransfer)).resolves.toBeUndefined();
    });

    it('should not pass validation if amount is 0', async () => {
      const { fromTransfer, toTransfer } = customTransferFactory({ amount: 0 });
      await expect(validateOrReject(fromTransfer)).rejects.toBeTruthy();
      await expect(validateOrReject(toTransfer)).rejects.toBeTruthy();
    });
  });
});
