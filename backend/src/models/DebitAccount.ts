import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Currency from './Currency';

@Entity()
export default class DebitAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name: string;

  @Column()
  bank: string;

  @Column()
  initialBalance: number;

  @Column()
  allowsNegative: boolean;

  @ManyToOne(() => Currency)
  currency: Currency;

  constructor(
    name: string,
    bank: string,
    initialBalance: number,
    allowsNegative: boolean,
    currency: Currency,
  ) {
    this.name = name;
    this.bank = bank;
    this.initialBalance = initialBalance;
    this.allowsNegative = allowsNegative;
    this.currency = currency;
  }
}
