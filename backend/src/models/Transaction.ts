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
import { v4 as uuid } from 'uuid';
import Account from './Account';
import Category from './Category';
import { IsValidCategory } from '../utils';

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

  @Field(() => Account)
  @ManyToOne(() => Account, { eager: false, onDelete: 'CASCADE' })
  account: Account;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(() => Category, { eager: false, onDelete: 'SET NULL' })
  @IsValidCategory()
  category?: Category;

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
    operationId?: string;
  }) {
    if (transaction) {
      this.amount = transaction.amount;
      this.accountId = transaction.accountId;
      this.memo = transaction.memo === '' ? undefined : transaction.memo;
      this.operationId = transaction.operationId || uuid();
    }
  }
}
