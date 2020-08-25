import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { NotEquals } from 'class-validator';
import Account from './Account';

@ObjectType()
@Entity()
export default class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column('integer')
  @NotEquals(0)
  amount: number;

  @Column()
  accountId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  memo?: string;

  @Column('uuid', { generated: 'uuid' })
  operationId: string;

  @Field(() => Int)
  @Column()
  resultantBalance: number;

  @Field(() => Account)
  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  account: Account;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(transaction: {
    amount: number;
    accountId: number;
    memo?: string;
    operationId: string;
    resultantBalance: number;
  }) {
    if (transaction) {
      this.amount = transaction.amount;
      this.accountId = transaction.accountId;
      this.memo = transaction.memo;
      this.operationId = transaction.operationId;
      this.resultantBalance = transaction.resultantBalance;
    }
  }
}
