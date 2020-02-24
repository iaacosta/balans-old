import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Currency from './Currency';

@Entity()
export default class CreditAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name: string;

  @Column()
  bank: string;

  @Column()
  initialBalance: number;

  @ManyToOne(() => Currency)
  currency: Currency;

  @Column()
  billingDay: number;

  @Column()
  paymentDay: number;

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
