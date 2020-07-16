/* eslint-disable prefer-destructuring */
import { ValidationError } from 'apollo-server-express';

export default class UniqueConstraintError extends ValidationError {
  constructor(error: any) {
    const { table, detail } = error;
    let column = 'column';

    if (detail) {
      const groups = detail.match(/^Key \((\w*)\).*$/);
      if (groups) column = groups[1];
    }

    super(`${table} with this ${column} already exists`);
  }
}
