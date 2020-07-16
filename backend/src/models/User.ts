import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { hash, genSalt, compare } from 'bcrypt';
import { MinLength, IsEmail, IsAlphanumeric, IsIn } from 'class-validator';
import { AuthenticationError } from 'apollo-server-express';

import ModelWithValidation from './ModelWithValidation';
import {
  emailErrorMessage,
  minLengthErrorMessage,
  alphanumericErrorMessage,
  isInErrorMessage,
} from '../errors/validationErrorMessages';

@ObjectType()
@Entity()
export default class User extends ModelWithValidation {
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
  @MinLength(6, { message: minLengthErrorMessage })
  password: string;

  @Column({ unique: true })
  @Field()
  @IsEmail({}, { message: emailErrorMessage })
  email: string;

  @Column({ unique: true })
  @Field()
  @MinLength(6, { message: minLengthErrorMessage })
  @IsAlphanumeric(undefined, { message: alphanumericErrorMessage })
  username: string;

  @Column({ default: 'user' })
  @IsIn(['admin', 'user'], { message: isInErrorMessage })
  role: 'admin' | 'user';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }

  async verifyPassword(password: string): Promise<true> {
    const error = new AuthenticationError('incorrect username or password');
    let correct: boolean;

    try {
      correct = await compare(password, this.password);
    } catch (err) {
      throw error;
    }

    if (!correct) throw error;
    return correct;
  }

  constructor(
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    username: string,
    role?: 'admin' | 'user',
  ) {
    super();

    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.email = email;
    this.username = username;
    this.role = role || 'user';
  }
}
