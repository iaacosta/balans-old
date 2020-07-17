import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { compare } from 'bcrypt';
import { MinLength, IsEmail, IsIn, Matches } from 'class-validator';
import { AuthenticationError } from 'apollo-server-express';

import ModelWithValidation from './ModelWithValidation';
import {
  emailErrorMessage,
  minLengthErrorMessage,
  isUsernameErrorMessage,
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
  @Matches(/[\w\d_\-\\.]+/, { message: isUsernameErrorMessage })
  username: string;

  @Column({ default: 'user' })
  @Field()
  @IsIn(['admin', 'user'], { message: isInErrorMessage })
  role: 'admin' | 'user';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  async verifyPassword(password: string) {
    const error = new AuthenticationError('incorrect username or password');
    try {
      if (!(await compare(password, this.password))) throw error;
    } catch (err) {
      throw error;
    }
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
