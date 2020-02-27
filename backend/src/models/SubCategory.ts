import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import Category from './Category';

@Entity()
export default class SubCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToOne(
    () => Category,
    (category) => category.subCategories,
    { onDelete: 'CASCADE' },
  )
  category: Category;

  @Column({ nullable: true })
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(name: string, category: Category) {
    this.name = name;
    this.category = category;
  }
}
