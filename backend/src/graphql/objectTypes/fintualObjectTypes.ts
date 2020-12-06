import { Field, Float, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Goal {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  value: number;

  @Field(() => Float)
  deposited: number;

  @Field(() => Float)
  profit: number;
}
