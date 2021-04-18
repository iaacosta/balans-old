import { InputType, Field, Int, ID, Float } from 'type-graphql';

@InputType()
export class CreateTransferInput {
  @Field(() => Int)
  amount: number;

  @Field(() => ID)
  fromAccountId: number;

  @Field(() => ID)
  toAccountId: number;

  @Field({ nullable: true })
  memo?: string;

  @Field(() => Float, { nullable: true })
  operationExchangeRate?: number;

  @Field(() => Date)
  issuedAt: Date;
}
