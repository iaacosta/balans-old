import { InputType, Field, Int } from 'type-graphql';
import { AccountType } from '../enums';
import { Currency } from '../enums/currencyEnum';

@InputType()
export class CreateAccountInput {
  @Field(() => AccountType)
  type: AccountType;

  @Field()
  name: string;

  @Field()
  bank: string;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => Int)
  initialBalance: number;
}
