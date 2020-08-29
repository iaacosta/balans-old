import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Unique,
} from 'typeorm';
import { IsIn } from 'class-validator';
import { ObjectType, Field, ID } from 'type-graphql';
import Transaction from './Transaction';
import User from './User';
import { CategoryType } from '../graphql/helpers';

@Entity()
@Unique(['name', 'userId'])
@ObjectType()
export default class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => CategoryType)
  @Column()
  @IsIn([CategoryType.expense, CategoryType.income])
  type: CategoryType;

  @Column()
  userId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.category, {
    eager: false,
    onDelete: 'SET NULL',
  })
  transactions: Transaction[];

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(category: { name: string; type: CategoryType; userId: number }) {
    if (!category) return;
    this.name = category.name;
    this.type = category.type;
    this.userId = category.userId;
  }
}
