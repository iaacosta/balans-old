/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';
import mockDate from 'mockdate';
import dayjs from 'dayjs';

import Account from '../../../models/_Account';
import _Currency from '../../../models/Currency';
import { AccountType } from '../../../@types';

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
    it('should pass validation if cash and initialBalance > 0', async () =>
      expect(
        await validateOrReject(
          new Account('cash', 'Account', 'Bank', 10, currency),
        ),
      ).toBeUndefined());

    it('should pass validation if vista and initialBalance > 0', async () =>
      expect(
        await validateOrReject(
          new Account('vista', 'Account', 'Bank', 10, currency),
        ),
      ).toBeUndefined());

    it('should pass validation if cash and initialBalance = 0', async () =>
      expect(
        await validateOrReject(
          new Account('cash', 'Account', 'Bank', 0, currency),
        ),
      ).toBeUndefined());

    it('should pass validation if vista and initialBalance = 0', async () =>
      expect(
        await validateOrReject(
          new Account('vista', 'Account', 'Bank', 0, currency),
        ),
      ).toBeUndefined());

    it('should not pass validation if cash and initialBalance < 0', async () =>
      expect(
        validateOrReject(new Account('cash', 'Account', 'Bank', -10, currency)),
      ).rejects.toBeTruthy());

    it('should not pass validation if vista and initialBalance < 0', async () =>
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

    it('should pass validation if credit and initialBalance = 0', async () =>
      expect(
        await validateOrReject(
          new Account('credit', 'Account', 'Bank', 0, currency, 1, 20),
        ),
      ).toBeUndefined());

    it('should not pass validation if credit and initialBalance > 0', async () =>
      expect(
        validateOrReject(
          new Account('credit', 'Account', 'Bank', 1000, currency, 10, 15),
        ),
      ).rejects.toBeTruthy());

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

  describe('methods', () => {
    const accountFactory = (
      initialBalance: number,
      billingDay: number,
      paymentDay: number,
      type: AccountType = 'credit',
    ) =>
      new Account(
        type,
        'Account',
        'Bank',
        initialBalance,
        currency,
        billingDay,
        paymentDay,
      );

    describe('currentBillingDate', () => {
      it('should return null billing date if not credit account', () => {
        mockDate.set('2020-01-29T15:00:00Z');
        const account = new Account(
          'checking',
          'Account',
          'Bank',
          0,
          currency,
          25,
          10,
        );
        expect(account.currentBillingDate).toBeNull();
      });

      describe('billingDay < paymentDay', () => {
        const account = accountFactory(0, 15, 20);

        it('should return null billing date outside payment period (before billing)', () => {
          mockDate.set('2020-01-10T15:00:00Z');
          expect(account.currentBillingDate).toBeNull();
        });

        it('should return null billing date outside payment period (after payment)', () => {
          mockDate.set('2020-01-25T15:00:00Z');
          expect(account.currentBillingDate).toBeNull();
        });

        it('should return correct billing date inside payment period', () => {
          mockDate.set('2020-01-16T15:00:00Z');
          expect(account.currentBillingDate).not.toBeNull();
          expect(account.currentBillingDate!.format('YYYY-MM-DD')).toBe(
            '2020-01-15',
          );
        });
      });

      describe('billingDay > paymentDay', () => {
        const account = accountFactory(0, 25, 5);

        it('should return null billing date outside payment period', () => {
          mockDate.set('2020-01-20T15:00:00Z');
          expect(account.currentBillingDate).toBeNull();
        });

        it('should return correct billing date inside payment period (billing month)', () => {
          mockDate.set('2020-01-26T15:00:00Z');
          expect(account.currentBillingDate).not.toBeNull();
          expect(account.currentBillingDate!.format('YYYY-MM-DD')).toBe(
            '2020-01-25',
          );
        });

        it('should return correct billing date inside payment period (payment month)', () => {
          mockDate.set('2020-02-01T15:00:00Z');
          expect(account.currentBillingDate).not.toBeNull();
          expect(account.currentBillingDate!.format('YYYY-MM-DD')).toBe(
            '2020-01-25',
          );
        });
      });
    });

    describe('nextBillingDate', () => {
      it('should return null billing date if not credit account', () => {
        mockDate.set('2020-01-29T15:00:00Z');
        const account = new Account(
          'checking',
          'Account',
          'Bank',
          0,
          currency,
          25,
          10,
        );

        expect(account.nextBillingDate).toBeNull();
      });

      it('should return correct billing date if outside payment period', () => {
        mockDate.set('2020-01-20T15:00:00Z');
        const account = accountFactory(1000, 25, 5);
        expect(account.nextBillingDate).not.toBeNull();
        expect(account.nextBillingDate!.format('YYYY-MM-DD')).toBe(
          '2020-01-25',
        );
      });

      it('should return correct billing date if inside payment period', () => {
        mockDate.set('2020-01-27T15:00:00Z');
        const account = accountFactory(1000, 25, 5);
        expect(account.nextBillingDate).not.toBeNull();
        expect(account.nextBillingDate!.format('YYYY-MM-DD')).toBe(
          '2020-02-25',
        );
      });
    });

    describe('nextPaymentDate', () => {
      it('should return null payment date if not credit account', () => {
        mockDate.set('2020-01-29T15:00:00Z');
        const account = new Account(
          'checking',
          'Account',
          'Bank',
          0,
          currency,
          25,
          10,
        );

        expect(account.nextPaymentDate).toBeNull();
      });

      it('should return correct payment date if outside payment period', () => {
        mockDate.set('2020-01-20T15:00:00Z');
        const account = accountFactory(1000, 25, 5);
        expect(account.nextPaymentDate).not.toBeNull();
        expect(account.nextPaymentDate!.format('YYYY-MM-DD')).toBe(
          '2020-02-05',
        );
      });

      it('should return correct payment date if inside payment period', () => {
        mockDate.set('2020-02-02T15:00:00Z');
        const account = accountFactory(1000, 25, 5);
        expect(account.nextPaymentDate).not.toBeNull();
        expect(account.nextPaymentDate!.format('YYYY-MM-DD')).toBe(
          '2020-02-05',
        );
      });
    });

    describe('relativeBillingDate', () => {
      it('should return null payment date if not credit account', () => {
        const account = new Account(
          'checking',
          'Account',
          'Bank',
          0,
          currency,
          25,
          10,
        );

        expect(
          account.relativeBillingDate(dayjs('2020-01-29T15:00:00Z')),
        ).toBeNull();
      });

      it('should return correct payment date if outside payment period', () => {
        const account = accountFactory(1000, 25, 5);
        const date = dayjs('2020-01-20T15:00:00Z');

        expect(account.relativeBillingDate(date)).not.toBeNull();
        expect(account.relativeBillingDate(date)!.format('YYYY-MM-DD')).toBe(
          '2020-01-25',
        );
      });

      it('should return correct payment date if inside payment period', () => {
        const account = accountFactory(1000, 25, 5);
        const date = dayjs('2020-02-02T15:00:00Z');

        expect(account.relativeBillingDate(date)).not.toBeNull();
        expect(account.relativeBillingDate(date)!.format('YYYY-MM-DD')).toBe(
          '2020-02-25',
        );
      });
    });

    describe('billingPeriodsApart', () => {
      it('should return null payment date if not credit account', () => {
        const account = new Account(
          'checking',
          'Account',
          'Bank',
          0,
          currency,
          25,
          10,
        );

        expect(
          account.billingPeriodsApart(dayjs('2020-01-29T15:00:00Z')),
        ).toBeNull();
      });

      it('should return correct number of periods if date after payment period', () => {
        const account = accountFactory(1000, 25, 5);
        const date = dayjs('2020-02-20T15:00:00Z');

        expect(account.billingPeriodsApart(date)).not.toBeNull();
        expect(account.billingPeriodsApart(date)).toBe(-1);
      });

      it('should return correct number of periods if date before payment period', () => {
        const account = accountFactory(1000, 25, 5);
        const date = dayjs('2020-01-05T15:00:00Z');

        expect(account.billingPeriodsApart(date)).not.toBeNull();
        expect(account.billingPeriodsApart(date)).toBe(0);
      });
    });

    describe('canPay', () => {
      it('should be able to pay if cash/vista and balance >= amount', () => {
        const account = accountFactory(0, 0, 0, 'cash');
        account.balance = 1000;
        expect(account.canPay(1000)).toBe(true);
      });

      it('should not be able to pay if cash/vista and balance < amount', () => {
        const account = accountFactory(0, 0, 0, 'cash');
        account.balance = 500;
        expect(account.canPay(1000)).toBe(false);
      });

      it('should be able to pay if not cash/vista and any amount', () => {
        const account = accountFactory(0, 0, 0, 'checking');
        account.balance = 0;
        expect(account.canPay(1000000)).toBe(true);
      });
    });

    describe('canReceive', () => {
      it('should be able to receive if credit and |balance| >= amount', () => {
        const account = accountFactory(0, 0, 0, 'credit');
        account.balance = -1000;
        expect(account.canReceive(1000)).toBe(true);
      });

      it('should not be able to receive if credit and |balance| < amount', () => {
        const account = accountFactory(0, 0, 0, 'credit');
        account.balance = -500;
        expect(account.canReceive(1000)).toBe(false);
      });

      it('should be able to receive if not credit and any amount', () => {
        const account = accountFactory(0, 0, 0, 'checking');
        account.balance = 0;
        expect(account.canReceive(1000000)).toBe(true);
      });
    });

    describe('balance and notBilled', () => {
      it('should have notBilled 0 event after calculated if not credit', () => {
        const account = new Account('checking', 'Account', 'Bank', 0, currency);

        account.expenses = [
          { amount: 1000, date: new Date('2020-01-01'), installments: 1 },
          { amount: 5000, date: new Date('2020-02-02'), installments: 1 },
          { amount: 6000, date: new Date('2020-03-03'), installments: 1 },
        ] as any[];

        account.calculateNotBilled();
        expect(account.notBilled).toBe(0);
      });

      it('should calculate debit balance correctly', () => {
        const account = new Account('checking', 'Account', 'Bank', 0, currency);

        account.incomes = [
          { amount: 1000 },
          { amount: 3000 },
          { amount: 4000 },
        ] as any[];

        account.expenses = [
          { amount: 1000 },
          { amount: 5000 },
          { amount: 6000 },
        ] as any[];

        account.calculateBalance();
        expect(account.balance).toBe(-4000);
      });

      describe('credit', () => {
        const expenseFactory = (
          amount: number,
          date: string,
          installments: number,
        ) => ({
          amount,
          date: dayjs(`2020-${date}T15:00:00Z`),
          installments,
        });

        describe('paymentDay < billingDay', () => {
          describe('before payment day', () => {
            beforeEach(() => mockDate.set('2020-02-25'));
            afterEach(mockDate.reset);

            it('should calculate credit balance correctly without installments', () => {
              const account = accountFactory(-1000, 20, 10);

              account.incomes = [];
              account.expenses = [
                expenseFactory(1000, '01-15', 1),
                expenseFactory(1000, '02-15', 1),
                expenseFactory(1000, '02-25', 1),
              ] as any[];

              account.calculateBalance();
              account.calculateNotBilled();
              expect(account.balance).toBe(-4000);
              expect(account.notBilled).toBe(1000);
            });

            it('should calculate credit balance correctly with installments', () => {
              const account = accountFactory(-1000, 20, 10);

              account.incomes = [];
              account.expenses = [
                expenseFactory(30000, '01-05', 3),
                expenseFactory(30000, '02-14', 3),
                expenseFactory(1000, '02-15', 1),
                expenseFactory(30000, '02-22', 3),
                expenseFactory(1000, '02-25', 1),
              ] as any[];

              account.calculateBalance();
              account.calculateNotBilled();
              expect(account.balance).toBe(-93000);
              expect(account.notBilled).toBe(61000);
            });
          });

          describe('after payment day', () => {
            beforeEach(() => mockDate.set('2020-03-25'));
            afterEach(mockDate.reset);

            it('should calculate credit balance correctly without installments', () => {
              const account = accountFactory(-1000, 20, 10);

              account.incomes = [];
              account.expenses = [
                expenseFactory(1000, '01-15', 1),
                expenseFactory(1000, '02-15', 1),
                expenseFactory(1000, '02-25', 1),
              ] as any[];

              account.calculateBalance();
              account.calculateNotBilled();
              expect(account.balance).toBe(-4000);
              expect(account.notBilled).toBe(0);
            });

            it('should calculate credit balance correctly with installments', () => {
              const account = accountFactory(-1000, 20, 10);

              account.incomes = [];
              account.expenses = [
                expenseFactory(30000, '01-05', 3),
                expenseFactory(30000, '02-14', 3),
                expenseFactory(1000, '02-15', 1),
                expenseFactory(30000, '02-22', 3),
                expenseFactory(1000, '02-25', 1),
              ] as any[];

              account.calculateBalance();
              account.calculateNotBilled();
              expect(account.balance).toBe(-93000);
              expect(account.notBilled).toBe(30000);
            });
          });
        });

        describe('paymentDay > billingDay', () => {
          describe('before payment day', () => {
            beforeEach(() => mockDate.set('2020-02-15'));
            afterEach(mockDate.reset);

            it('should calculate credit balance correctly without installments', () => {
              const account = accountFactory(-1000, 10, 20);

              account.incomes = [];
              account.expenses = [
                expenseFactory(1000, '01-25', 1),
                expenseFactory(1000, '02-05', 1),
                expenseFactory(1000, '02-15', 1),
              ] as any[];

              account.calculateBalance();
              account.calculateNotBilled();
              expect(account.balance).toBe(-4000);
              expect(account.notBilled).toBe(1000);
            });

            it('should calculate credit balance correctly with installments', () => {
              const account = accountFactory(-1000, 10, 20);

              account.incomes = [];
              account.expenses = [
                expenseFactory(30000, '01-05', 3),
                expenseFactory(30000, '02-05', 3),
                expenseFactory(1000, '02-09', 1),
                expenseFactory(30000, '02-12', 3),
                expenseFactory(1000, '02-15', 1),
              ] as any[];

              account.calculateBalance();
              account.calculateNotBilled();
              expect(account.balance).toBe(-93000);
              expect(account.notBilled).toBe(61000);
            });
          });

          describe('after payment day', () => {
            beforeEach(() => mockDate.set('2020-02-25'));
            afterEach(mockDate.reset);

            it('should calculate credit balance correctly without installments', () => {
              const account = accountFactory(-1000, 10, 20);

              account.incomes = [];
              account.expenses = [
                expenseFactory(1000, '01-15', 1),
                expenseFactory(1000, '02-05', 1),
                expenseFactory(1000, '02-15', 1),
              ] as any[];

              account.calculateBalance();
              account.calculateNotBilled();
              expect(account.balance).toBe(-4000);
              expect(account.notBilled).toBe(0);
            });

            it('should calculate credit balance correctly with installments', () => {
              const account = accountFactory(-1000, 10, 20);

              account.incomes = [];
              account.expenses = [
                expenseFactory(30000, '01-05', 3),
                expenseFactory(30000, '02-05', 3),
                expenseFactory(1000, '02-09', 1),
                expenseFactory(30000, '02-12', 3),
                expenseFactory(1000, '02-15', 1),
              ] as any[];

              account.calculateBalance();
              account.calculateNotBilled();
              expect(account.balance).toBe(-93000);
              expect(account.notBilled).toBe(30000);
            });
          });
        });
      });
    });
  });
});
