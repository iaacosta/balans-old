import { UserInputError } from 'apollo-server-express';

const prependAToResource = (resource: string) => {
  if (['a', 'e', 'i', 'o', 'u'].includes(resource[0])) return `an ${resource}`;
  return `a ${resource}`;
};

export default class NotFoundError extends UserInputError {
  constructor(resource: string) {
    super(
      `couldn't find ${prependAToResource(resource)} with such identifier`,
      { id: 'non existing' },
    );
  }
}
