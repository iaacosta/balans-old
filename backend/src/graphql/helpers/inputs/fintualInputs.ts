import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterFintualAPIInput {
  @Field()
  email: string;

  @Field()
  token: string;
}
