/* eslint-disable prefer-destructuring */
import { ValidationError } from 'apollo-server-express';

export default class UniqueConstraintError extends ValidationError {
  constructor(error: any) {
    const { table, detail } = error;
    let columns = ['column'];

    if (detail) {
      const groups = detail.match(/^Key \(([\w, ]*)\).*$/);
      if (groups) columns = groups[1].split(',');
    }

    super(`${table} with this ${columns.join(' and ')} already exists`);
  }
}
