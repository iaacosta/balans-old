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
import Transaction from './Transaction';
import User from './User';

@Entity()
@Unique(['name', 'userId'])
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsIn(['expense', 'income'])
  type: 'expense' | 'income';

  @Column()
  userId: number;

  @OneToMany(() => Transaction, (transaction) => transaction.category, {
    eager: false,
    onDelete: 'SET NULL',
  })
  transactions: Transaction[];

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(category: {
    name: string;
    type: 'expense' | 'income';
    userId: number;
  }) {
    if (!category) return;
    this.name = category.name;
    this.type = category.type;
    this.userId = category.userId;
  }
}
