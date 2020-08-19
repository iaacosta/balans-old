import { UserInputError } from 'apollo-server-express';
import a from 'indefinite';

export default class NotFoundError extends UserInputError {
  constructor(resource?: string) {
    super(`couldn't find ${a(resource || 'resource')} with such identifier`, {
      id: 'non existing',
    });
  }
}
