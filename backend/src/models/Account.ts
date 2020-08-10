import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { IsNotEmpty, IsIn } from 'class-validator';

import { IsValidBalance } from '../utils';
import { AccountType } from '../graphql/helpers';
import User from './User';

@ObjectType()
@Entity()
export default class Account {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => AccountType)
  @Column()
  @IsIn(['cash', 'vista', 'checking'] as AccountType[])
  type: AccountType;

  @Field()
  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Field()
  @Column()
  @IsNotEmpty()
  bank: string;

  @Field(() => Int)
  @Column()
  @IsValidBalance()
  balance: number;

  @Column({ nullable: true })
  userId: number | null;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user?: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(account: {
    type: AccountType;
    name: string;
    bank: string;
    initialBalance: number;
    userId?: number;
  }) {
    if (!account) return;
    this.type = account.type;
    this.name = account.name;
    this.bank = account.bank;
    this.balance = account.initialBalance;
    this.userId = account.userId || null;
  }
}
