import { ApolloError } from 'apollo-server-express';

export default class NoChangesError extends ApolloError {
  constructor() {
    super('you must provide at least one field to change', 'NO_CHANGES');
  }
}
