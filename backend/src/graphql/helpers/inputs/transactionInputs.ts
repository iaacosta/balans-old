import { InputType, Field, Int, ID } from 'type-graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => Int)
  amount: number;

  @Field(() => ID)
  accountId: number;

  @Field({ nullable: true })
  memo?: string;
}
