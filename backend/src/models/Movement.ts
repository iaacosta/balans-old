import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  EntityManager,
  getManager,
  ManyToOne,
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  memo?: string;

  @Field()
  @Column('uuid', { generated: 'uuid' })
  operationId: string;

  @Column()
  accountId: number;

  @Field(() => Account)
  @ManyToOne(() => Account, { eager: false, onDelete: 'CASCADE' })
  account: Account;

  @Field()
  @Column('timestamp without time zone', { default: () => 'NOW()' })
  issuedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  static async saveMovementPair<T extends Movement>(
    movements: [T, T],
    options?: { manager?: EntityManager },
  ): Promise<[T, T]> {
    const manager = options?.manager || getManager();
    const savedMovements = await manager.save(movements);
    return savedMovements as [T, T];
  }

  static async removeMovementPair<T extends Movement>(
    movements: [T, T],
    options?: { manager?: EntityManager },
  ): Promise<[T, T]> {
    const manager = options?.manager || getManager();
    const removedMovements = await manager.remove(movements);
    return removedMovements as [T, T];
  }

  constructor(movement: {
    amount: number;
    accountId: number;
    issuedAt?: Date;
    memo?: string;
    operationId?: string;
  }) {
    if (movement) {
      this.amount = movement.amount;
      this.issuedAt = movement.issuedAt || new Date();
      this.accountId = movement.accountId;
      this.memo = movement.memo === '' ? undefined : movement.memo;
      this.operationId = movement.operationId || uuid();
    }
  }
}
