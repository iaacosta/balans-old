import { ApolloError } from 'apollo-server-express';
import a from 'indefinite';

export default class NotFoundError extends ApolloError {
  constructor(resource?: string) {
    super(
      `couldn't find ${a(resource || 'resource')} with such identifier`,
      'NOT_FOUND',
    );
  }
}
