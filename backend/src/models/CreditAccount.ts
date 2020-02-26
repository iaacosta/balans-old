import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, Min, Max } from 'class-validator';
import Currency from './Currency';

@Entity()
export default class CreditAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  bank: string;

  @Column()
  initialBalance: number;

  @ManyToOne(() => Currency, { onDelete: 'SET NULL' })
  currency: Currency;

  @Column()
  @Min(1)
  @Max(30)
  billingDay: number;

  @Column()
  @Min(1)
  @Max(30)
  paymentDay: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(
    name: string,
    bank: string,
    initialBalance: number,
    currency: Currency,
    billingDay: number,
    paymentDay: number,
  ) {
    this.name = name;
    this.bank = bank;
    this.initialBalance = initialBalance;
    this.currency = currency;
    this.billingDay = billingDay;
    this.paymentDay = paymentDay;
  }
}
