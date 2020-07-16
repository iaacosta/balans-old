import { UserInputError } from 'apollo-server-express';

const prependAToResource = (resource: string) => {
  if (['a', 'e', 'i', 'o', 'u'].includes(resource[0])) return `an ${resource}`;
  return `a ${resource}`;
};

export default class NotFoundError extends UserInputError {
  constructor(error: Error) {
    let resource = 'resource';

    let matching = error.message.match(/^.* "(.*)" matching.*$/);
    if (matching) resource = matching[1].toLowerCase();

    super(
      `couldn't find ${prependAToResource(resource)} with such identifier`,
      { id: 'non existing' },
    );
  }
}
