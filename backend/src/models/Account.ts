import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
  getConnection,
  EntityManager,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { IsNotEmpty, IsIn } from 'class-validator';

import { IsValidBalance } from '../utils';
import { AccountType } from '../graphql/helpers';
import User from './User';
import Transaction from './Transaction';

@ObjectType()
@Unique(['name', 'bank', 'userId'])
@Entity()
export default class Account {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => AccountType)
  @Column()
  @IsIn(['cash', 'vista', 'checking', 'root'] as AccountType[])
  type: AccountType | 'root';

  @Field()
  @Column()
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
  userId?: number;

  @Field(() => User)
  @ManyToOne(() => User, { eager: false, onDelete: 'SET NULL' })
  user?: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account, {
    eager: false,
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];

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
    type: AccountType | 'root';
    name: string;
    bank: string;
    userId?: number;
  }) {
    if (!account) return;
    this.type = account.type;
    this.name = account.name;
    this.bank = account.bank;
    this.userId = account.userId;
    this.balance = 0;
  }

  private async _findRootAccount(manager: EntityManager) {
    return manager.getRepository(Account).findOneOrFail({
      type: 'root',
      userId: this.userId,
    });
  }

  private async _performTransaction(amount: number, manager: EntityManager) {
    const rootAccount = await this._findRootAccount(manager);

    this.balance += amount;
    rootAccount.balance -= amount;

    await manager.getRepository(Account).save(this);
    await manager.getRepository(Account).save(rootAccount);

    const [transaction] = await manager.getRepository(Transaction).save([
      new Transaction({
        amount,
        accountId: this.id,
        resultantBalance: this.balance,
      }),
      new Transaction({
        amount: -amount,
        accountId: rootAccount.id,
        resultantBalance: rootAccount.balance,
      }),
    ]);

    return transaction;
  }

  async performTransaction(
    amount: number,
    options: PerformTransactionOptions = { transaction: true },
  ) {
    if (options.transaction) {
      return getConnection().transaction((entityManager) =>
        this._performTransaction(amount, entityManager),
      );
    }

    return this._performTransaction(amount, options.entityManager);
  }
}

type PerformTransactionOptions =
  | { transaction: false; entityManager: EntityManager }
  | { transaction: true; entityManager?: EntityManager };
