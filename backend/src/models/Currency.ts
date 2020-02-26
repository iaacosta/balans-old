import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import DebitAccount from './DebitAccount';
import CreditAccount from './CreditAccount';

@Entity()
export default class Currency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @Length(3, 3)
  name: string;

  @OneToMany(
    () => DebitAccount,
    (acc) => acc.currency,
  )
  debitAccounts!: DebitAccount[];

  @OneToMany(
    () => CreditAccount,
    (acc) => acc.currency,
  )
  creditAccounts!: CreditAccount[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(name: string) {
    this.name = name;
  }
}
