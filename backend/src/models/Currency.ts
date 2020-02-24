import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Currency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
