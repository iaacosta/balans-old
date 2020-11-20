import {
  Entity,
  Column,
  ManyToOne,
  DeleteDateColumn,
  getManager,
  Not,
} from 'typeorm';
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

  @Column()
  root: boolean;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  async getPairedTransaction(): Promise<Transaction> {
    return getManager()
      .getRepository(Transaction)
      .findOneOrFail({ id: Not(this.id), operationId: this.operationId });
  }

  constructor(transaction: {
    amount: number;
    accountId: number;
    issuedAt?: Date;
    memo?: string;
    operationId?: string;
    category?: Category;
    root?: boolean;
  }) {
    super(transaction);
    if (transaction) {
      this.category = transaction.category;
      this.root = transaction.root || false;
    }
  }
}
