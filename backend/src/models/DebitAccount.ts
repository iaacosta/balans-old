import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ValidateIf, Min, IsNotEmpty } from 'class-validator';
import Currency from './Currency';

@Entity()
export default class DebitAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  bank: string;

  @Column()
  @ValidateIf((self) => !self.allowsNegative)
  @Min(0)
  initialBalance: number;

  @Column()
  allowsNegative: boolean;

  @ManyToOne(() => Currency, { onDelete: 'SET NULL' })
  currency: Currency;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

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
