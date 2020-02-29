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
import { Min, IsObject, registerDecorator } from 'class-validator';

import Account from './Account';
import SubCategory from './SubCategory';
import Place from './Place';

const IsInstallments = () => (object: object, propertyName: string) =>
  registerDecorator({
    target: object.constructor,
    propertyName,
    validator: {
      validate: (installments: number, { object: expense }: any) => {
        if (installments < 1) return false;
        if (expense.account.type !== 'credit' && installments > 1) return false;
        return true;
      },
      defaultMessage: () =>
        'installments should always be greater than 1 and exactly 1 if non-credit account given',
    },
  });

@Entity()
export default class Expense {
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

  @Column()
  @IsInstallments()
  installments: number;

  @ManyToOne(
    () => Account,
    (acc) => acc.expenses,
    { onDelete: 'CASCADE' },
  )
  account: Account;

  @ManyToOne(
    () => SubCategory,
    (subCat) => subCat.expenses,
    { onDelete: 'SET NULL' },
  )
  subCategory: SubCategory;

  @ManyToOne(
    () => Place,
    (place) => place.expenses,
    { onDelete: 'SET NULL' },
  )
  place: Place;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(
    amount: number,
    date: dayjs.Dayjs,
    account: Account,
    subCategory: SubCategory,
    place: Place,
    description?: string,
    installments?: number,
  ) {
    this.amount = amount;
    this.date = date;
    this.account = account;
    this.subCategory = subCategory;
    this.place = place;
    this.description = description || '';
    this.installments = installments !== undefined ? installments : 1;
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
