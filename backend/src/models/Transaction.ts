import { Entity, Column, ManyToOne, DeleteDateColumn } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import Category from './Category';
import { IsValidCategory } from '../utils';
import Movement from './Movement';

@ObjectType()
@Entity()
export default class Transaction extends Movement {
  @Column({ nullable: true })
  categoryId?: number;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, { eager: false, onDelete: 'SET NULL' })
  @IsValidCategory()
  category?: Category;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(transaction: {
    amount: number;
    accountId: number;
    issuedAt?: Date;
    memo?: string;
    operationId?: string;
    category?: Category;
  }) {
    super(transaction);
    if (transaction) {
      this.category = transaction.category;
    }
  }
}
