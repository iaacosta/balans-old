import { InputType, Field, Int, ID } from 'type-graphql';

@InputType()
export class CreatePassiveInput {
  @Field(() => Int)
  amount: number;

  @Field(() => ID)
  accountId: number;

  @Field({ nullable: true })
  memo?: string;

  @Field(() => Date)
  issuedAt: Date;
}
