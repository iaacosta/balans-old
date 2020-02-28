import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ValidateIf, Min, IsNotEmpty, IsIn, Max } from 'class-validator';

import Currency from './Currency';
import { AccountType } from '../@types';
import Income from './Income';

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

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

    if (type === 'credit' && billingDay === undefined) throw err;
    if (type === 'credit' && paymentDay === undefined) throw err;

    this.billingDay = billingDay || 0;
    this.paymentDay = paymentDay || 0;
  }
}
