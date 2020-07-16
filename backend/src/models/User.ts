import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { hash, genSalt } from 'bcrypt';

@ObjectType()
@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Field()
  name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column()
  password: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  async hashPassword() {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }

  constructor(
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    username: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.email = email;
    this.username = username;
  }
}
