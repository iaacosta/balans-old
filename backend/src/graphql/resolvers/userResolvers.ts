import { Resolver, Query, Mutation } from 'type-graphql';

@Resolver()
export default class UserResolvers {
  @Query()
  users(): string {
    return 'yes';
  }

  @Mutation()
  createUser(): string {
    return 'yes';
  }
}
