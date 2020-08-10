import { InputType, Field, Int } from 'type-graphql';
import { AccountType } from '../enums';

@InputType()
export class CreateAccountInput {
  @Field(() => AccountType)
  type: AccountType;

  @Field()
  name: string;

  @Field()
  bank: string;

  @Field(() => Int)
  initialBalance: number;
}
