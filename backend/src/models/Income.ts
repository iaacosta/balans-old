import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  AfterLoad,
  BeforeInsert,
} from 'typeorm';
import dayjs from 'dayjs';
import { Min, IsObject } from 'class-validator';

import Account from './Account';
import SubCategory from './SubCategory';

@Entity()
export default class Income {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'float' })
  @Min(0)
  amount: number;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  @IsObject()
  date: dayjs.Dayjs;

  @ManyToOne(
    () => Account,
    (acc) => acc.incomes,
    { onDelete: 'CASCADE' },
  )
  account: Account;

  @ManyToOne(
    () => SubCategory,
    (subCat) => subCat.incomes,
    { onDelete: 'SET NULL' },
  )
  subCategory: SubCategory;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(
    amount: number,
    date: dayjs.Dayjs,
    account: Account,
    subCategory: SubCategory,
    description?: string,
  ) {
    this.amount = amount;
    this.description = description || '';
    this.date = date;
    this.account = account;
    this.subCategory = subCategory;
  }

  @BeforeInsert()
  parseAttributes() {
    this.date = this.date.toDate() as any;
  }

  @AfterLoad()
  serializeAttributes() {
    this.date = dayjs(this.date);
  }
}
