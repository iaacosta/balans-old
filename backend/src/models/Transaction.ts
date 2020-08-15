import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import Account from './Account';

@Entity()
export default class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  amount: number;

  @Column()
  accountId: number;

  @Column()
  resultantBalance: number;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  account: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(transaction: {
    amount: number;
    accountId: number;
    resultantBalance: number;
  }) {
    if (transaction) {
      this.amount = transaction.amount;
      this.accountId = transaction.accountId;
      this.resultantBalance = transaction.resultantBalance;
    }
  }
}
