import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { IsNotEmpty, IsUrl, IsLatitude, IsLongitude } from 'class-validator';

@Entity()
export default class Place {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsUrl()
  photoUri: string;

  @Column({ type: 'float' })
  @IsLatitude()
  latitude: number;

  @Column({ type: 'float' })
  @IsLongitude()
  longitude: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(
    name: string,
    photoUri: string,
    latitude: number,
    longitude: number,
  ) {
    this.name = name;
    this.photoUri = photoUri;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
