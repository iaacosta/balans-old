import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import dayjs, { Dayjs } from 'dayjs';
import { ValidateIf, Min, IsNotEmpty, IsIn, Max } from 'class-validator';

import Currency from './Currency';
import { AccountType } from '../@types';
import Income from './Income';
import Expense from './Expense';

@Entity()
export default class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsIn(['cash', 'vista', 'checking', 'credit'])
  type: AccountType;

  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  bank: string;

  @Column()
  @ValidateIf((acc) => ['cash', 'vista'].includes(acc.type))
  @Min(0)
  initialBalance: number;

  @ManyToOne(() => Currency, { onDelete: 'SET NULL' })
  currency: Currency;

  @Column()
  @ValidateIf((acc) => acc.type === 'credit')
  @Min(1)
  @Max(30)
  billingDay: number;

  @Column()
  @ValidateIf((acc) => acc.type === 'credit')
  @Min(1)
  @Max(30)
  paymentDay: number;

  @OneToMany(
    () => Income,
    (income) => income.account,
  )
  incomes!: Income[];

  @OneToMany(
    () => Expense,
    (expense) => expense.account,
  )
  expenses!: Expense[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  balance: number;

  notBilled: number;

  constructor(
    type: AccountType,
    name: string,
    bank: string,
    initialBalance: number,
    currency: Currency,
    billingDay?: number,
    paymentDay?: number,
  ) {
    this.type = type;
    this.name = name;
    this.bank = bank;
    this.initialBalance = initialBalance;
    this.currency = currency;

    const err = new Error(
      'you must provide billing and payment days if type is credit',
    );

    if (
      type === 'credit' &&
      (paymentDay === undefined || billingDay === undefined)
    ) {
      throw err;
    }

    this.billingDay = billingDay || 0;
    this.paymentDay = paymentDay || 0;

    this.balance = 0;
    this.notBilled = 0;
  }

  @AfterLoad()
  calculateBalance() {
    if (!this.expenses || !this.incomes) return;

    this.balance =
      this.incomes.reduce((accum, { amount }) => accum + amount, 0) +
      this.initialBalance -
      this.expenses.reduce((accum, { amount }) => accum + amount, 0);
  }

  @AfterLoad()
  calculateNotBilled() {
    if (!this.expenses || !this.incomes) return;
    if (this.type !== 'credit') return;

    /* First, we sum up all expenses that were made with more than 1 installment */
    const installmentsExpenses = this.expenses.filter(
      ({ installments }) => installments > 2,
    );

    const installmentsAmounts = installmentsExpenses.map(
      ({ amount, date, installments }) => {
        const installmentValue = Math.round(amount / installments);
        const periodsApart = this.billingPeriodsApart(dayjs(date));
        return installmentValue * (installments - (periodsApart + 1));
      },
    );

    this.notBilled += installmentsAmounts.reduce(
      (accum, curr) => accum + curr,
      0,
    );

    /* If we're in no billing period, then no more is added */
    const { currentBillingDate } = this;
    if (!currentBillingDate) return;

    /* If we are, then we should sum up all the post-billing expenses */
    const normalExpenses = this.expenses.filter(
      ({ installments, date }) =>
        installments === 1 && date > currentBillingDate,
    );

    this.notBilled += normalExpenses.reduce(
      (accum, { amount }) => accum + amount,
      0,
    );
  }

  get nextBillingDate() {
    if (this.type !== 'credit') return null;

    let billingDate = dayjs()
      .startOf('day')
      .set('date', this.billingDay);

    if (dayjs().date() > this.billingDay) {
      billingDate = billingDate.add(1, 'month');
    }

    return billingDate;
  }

  get nextPaymentDate() {
    if (this.type !== 'credit') return null;

    let paymentDate = dayjs()
      .endOf('day')
      .set('date', this.paymentDay);

    if (dayjs().date() > this.paymentDay) {
      paymentDate = paymentDate.add(1, 'month');
    }

    return paymentDate;
  }

  get currentBillingDate() {
    if (this.type !== 'credit') return null;

    let billingDate = dayjs()
      .endOf('day')
      .set('date', this.billingDay);

    const currentDay = dayjs().date();

    if (this.paymentDay > this.billingDay) {
      if (
        (currentDay < this.billingDay && currentDay < this.paymentDay) ||
        (currentDay > this.paymentDay && currentDay > this.billingDay)
      ) {
        return null;
      }
    } else {
      if (currentDay < this.billingDay && currentDay > this.paymentDay) {
        return null;
      }

      if (currentDay < this.paymentDay) {
        billingDate = billingDate.subtract(1, 'month');
      }
    }

    return billingDate;
  }

  relativeBillingDate(date: Dayjs) {
    let billingDate = date.startOf('day').set('date', this.billingDay);
    if (date > billingDate) billingDate = billingDate.add(1, 'month');
    return billingDate;
  }

  billingPeriodsApart(date: Dayjs) {
    const billingDate = this.currentBillingDate || this.nextBillingDate;
    if (!billingDate) return -1;
    const relativeBillingDate = this.relativeBillingDate(date);
    return billingDate.diff(relativeBillingDate, 'month');
  }
}
