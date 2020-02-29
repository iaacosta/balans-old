import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty, IsLatitude, IsLongitude } from 'class-validator';
import Expense from './Expense';

@Entity()
export default class Place {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  photoUri: string;

  @Column({ type: 'float' })
  @IsLatitude()
  latitude: number;

  @Column({ type: 'float' })
  @IsLongitude()
  longitude: number;

  @OneToMany(
    () => Expense,
    (expense) => expense.account,
  )
  expenses!: Expense[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(name: string, latitude: number, longitude: number) {
    this.name = name;
    this.photoUri = '';
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
