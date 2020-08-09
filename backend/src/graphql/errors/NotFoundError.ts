import { UserInputError } from 'apollo-server-express';
import a from 'indefinite';

export default class NotFoundError extends UserInputError {
  constructor(error: Error) {
    let resource = 'resource';

    const matching = error.message.match(/^.* "(.*)" matching.*$/);
    if (matching) resource = matching[1].toLowerCase();

    super(`couldn't find ${a(resource)} with such identifier`, {
      id: 'non existing',
    });
  }
}
