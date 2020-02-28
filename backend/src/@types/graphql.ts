import { IFieldResolver } from 'apollo-server-express';
import S3Helper from '../utils/S3Helper';

export type QueryResolvers<T, Q extends string> = {
  [key in Q]: IFieldResolver<void, { s3: S3Helper }, T>;
};

export type MutationResolvers<T, M extends string> = {
  [key in M]: IFieldResolver<void, { s3: S3Helper }, T>;
};

export type ResolverMap<T, Q extends string, M extends string> = {
  Query: QueryResolvers<T, Q>;
  Mutation: QueryResolvers<T, M>;
};
