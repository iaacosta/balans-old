import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class ByIdInput {
  @Field(() => ID)
  id: number;
}
