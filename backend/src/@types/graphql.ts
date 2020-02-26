import { IFieldResolver } from 'apollo-server-express';

export type QueryResolvers<T, Q extends string> = {
  [key in Q]: IFieldResolver<void, void, T>;
};

export type MutationResolvers<T, M extends string> = {
  [key in M]: IFieldResolver<void, void, T>;
};

export type ResolverMap<T, Q extends string, M extends string> = {
  Query: QueryResolvers<T, Q>;
  Mutation: QueryResolvers<T, M>;
};
