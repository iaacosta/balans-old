import { AuthenticationError } from 'apollo-server-express';

export default class FintualAuthenticationError extends AuthenticationError {
  constructor() {
    super('your fintual credentials are not working');
  }
}
