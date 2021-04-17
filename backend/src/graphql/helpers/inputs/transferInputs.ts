import { InputType, Field, Int, ID } from 'type-graphql';

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

  @Field(() => Date)
  issuedAt: Date;
}
