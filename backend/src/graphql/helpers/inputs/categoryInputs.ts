import { InputType, Field, ID } from 'type-graphql';
import { CategoryType } from '../enums';

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;

  @Field()
  color: string;

  @Field(() => CategoryType)
  type: CategoryType;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => CategoryType, { nullable: true })
  type?: CategoryType;
}
