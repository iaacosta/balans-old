import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import DebitAccount from './DebitAccount';
import CreditAccount from './CreditAccount';

@Entity()
export default class Currency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

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

  constructor(name: string) {
    this.name = name;
  }
}
