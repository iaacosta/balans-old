import { AuthenticationError } from 'apollo-server-express';

export default class TokenExpiredError extends AuthenticationError {
  constructor() {
    super('your token has expired');
  }
}
