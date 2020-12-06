import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  EntityManager,
  getManager,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { MinLength, IsEmail, IsIn, Matches, IsNotEmpty } from 'class-validator';
import { AuthenticationError } from 'apollo-server-express';

import {
  emailErrorMessage,
  minLengthErrorMessage,
  isUsernameErrorMessage,
  isInErrorMessage,
} from '../errors/validationErrorMessages';
import Account from './Account';
import Category from './Category';
import CryptoHelper from '../utils/cryptoHelper';

@ObjectType()
@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field()
  @Column()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @Column()
  @IsNotEmpty()
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
  @Matches(/^[a-zA-Z0-9_\-\\.]+$/, { message: isUsernameErrorMessage })
  username: string;

  @Column({ default: 'user' })
  @Field()
  @IsIn(['admin', 'user'], { message: isInErrorMessage })
  role: 'admin' | 'user';

  @Field(() => [Account])
  @OneToMany(() => Account, (account) => account.user, {
    eager: false,
    onDelete: 'SET NULL',
  })
  accounts: Account[];

  @Field(() => [Category])
  @OneToMany(() => Category, (category) => category.user, {
    eager: false,
    onDelete: 'SET NULL',
  })
  categories: Category[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date;

  async verifyPassword(password: string): Promise<void> {
    const equal = await CryptoUtil.verifyHash({
      data: password,
      hashed: this.password,
    });

    if (!equal) throw new AuthenticationError('incorrect username or password');
  }

  getRootAccount(options?: { manager?: EntityManager }): Promise<Account> {
    const manager = options?.manager || getManager();
    return manager
      .getRepository(Account)
      .findOneOrFail({ userId: this.id, type: 'root' });
  }

  constructor(user: {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    username: string;
    role?: 'admin' | 'user';
  }) {
    if (user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.password = user.password;
      this.email = user.email;
      this.username = user.username;
      this.role = user.role || 'user';
    }
  }
}
