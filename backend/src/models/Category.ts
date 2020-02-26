import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsIn } from 'class-validator';

type Type = 'expense' | 'income';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsIn(['expense', 'income'])
  type: Type;

  @Column()
  @IsNotEmpty()
  icon: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(name: string, type: Type, icon: string) {
    this.name = name;
    this.type = type;
    this.icon = icon;
  }
}
