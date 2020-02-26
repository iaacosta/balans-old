import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty, IsIn } from 'class-validator';
import { CategoryType } from '../@types';
import SubCategory from './SubCategory';

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

  @OneToMany(
    () => SubCategory,
    (subCat) => subCat.category,
  )
  subCategories!: SubCategory[];

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
