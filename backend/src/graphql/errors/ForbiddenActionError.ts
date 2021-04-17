import { ApolloError } from 'apollo-server-express';

export default class ForbiddenActionError extends ApolloError {
  constructor(action: string) {
    super(`you are not allowed to ${action}`, 'FORBIDDEN_ACTION');
  }
}
