import { IFieldResolver } from 'apollo-server-express';

export interface Resolvers<T> {
  [key: string]: IFieldResolver<void, void, T>;
}
