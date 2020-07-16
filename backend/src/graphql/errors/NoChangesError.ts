import { UserInputError } from 'apollo-server-express';

export default class NoChangesError extends UserInputError {
  constructor() {
    super('you must provide at least one field to change');
  }
}
