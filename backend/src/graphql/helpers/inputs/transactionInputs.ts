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

@InputType()
export class UpdateTransactionInput {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { nullable: true })
  amount?: number;

  @Field({ nullable: true })
  memo?: string;

  @Field(() => ID, { nullable: true })
  accountId?: number;
}
