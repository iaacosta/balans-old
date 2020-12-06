import { ApolloError } from 'apollo-server-express';

export default class FintualUnknownError extends ApolloError {
  constructor() {
    super('an unknown error happened on fintual side');
  }
}
