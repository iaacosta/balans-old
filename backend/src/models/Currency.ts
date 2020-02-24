import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class Currency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  constructor(name: string) {
    this.name = name;
  }
}
