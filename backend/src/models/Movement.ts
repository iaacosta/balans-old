import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotEquals } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import Account from './Account';

@ObjectType()
export default abstract class Movement {
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

  @Field()
  @Column('uuid', { generated: 'uuid' })
  operationId: string;

  @Field(() => Account)
  @ManyToOne(() => Account, { eager: false, onDelete: 'CASCADE' })
  account: Account;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(movement: {
    amount: number;
    accountId: number;
    memo?: string;
    operationId?: string;
  }) {
    if (movement) {
      this.amount = movement.amount;
      this.accountId = movement.accountId;
      this.memo = movement.memo === '' ? undefined : movement.memo;
      this.operationId = movement.operationId || uuid();
    }
  }
}
