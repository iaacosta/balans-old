import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import DebitAccount from './DebitAccount';

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

  constructor(name: string) {
    this.name = name;
  }
}
