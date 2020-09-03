/* eslint-disable prefer-destructuring */
import { ApolloError } from 'apollo-server-express';
import { replace, startCase } from 'lodash';

export default class UniqueConstraintError extends ApolloError {
  constructor(error: unknown) {
    const { table, detail } = error as { table: string; detail: string };
    let columns = ['column'];

    if (detail) {
      const groups = detail.match(/^Key \(([\w, "]*)\).*$/);
      if (groups) {
        columns = replace(replace(groups[1], /"/g, ''), /userId/g, '')
          .split(',')
          .map(startCase)
          .filter((col) => col !== '');
      }
    }

    let stringifiedColumns: string;
    if (columns.length > 1) {
      stringifiedColumns = `${columns
        .slice(0, columns.length - 1)
        .join(', ')} and ${columns[columns.length - 1]}`;
    } else {
      stringifiedColumns = columns[0];
    }

    super(
      `${table} with this ${stringifiedColumns} already exists`,
      'UNIQUE_CONSTRAINT',
    );
  }
}
