import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsIn } from 'class-validator';
import { CategoryType } from '../@types';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsIn(['expense', 'income'])
  type: CategoryType;

  @Column()
  @IsNotEmpty()
  icon: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(name: string, type: CategoryType, icon: string) {
    this.name = name;
    this.type = type;
    this.icon = icon;
  }
}
