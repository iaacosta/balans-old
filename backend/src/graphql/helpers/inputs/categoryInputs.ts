import { InputType, Field } from 'type-graphql';
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
