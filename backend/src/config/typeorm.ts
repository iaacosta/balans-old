import { InsertQueryBuilder } from 'typeorm/query-builder/InsertQueryBuilder';

// Declaration Merging Of Module.
declare module 'typeorm/query-builder/InsertQueryBuilder' {
  interface InsertQueryBuilder<Entity> {
    /**
     * Applies .returning(columns: string[]) to the query builder
     * @remarks There could be an improvement in this function
     * @param additionalColumns any columns that are not given in the inserted values
     * @returns a chainable query builder
     * @example queryBuilder.getEntity(['defaultColumn'])
     */
    getEntity: typeof getEntity;
  }
}

async function getEntity<Entity>(
  this: InsertQueryBuilder<Entity>,
  aditionalColumns?: string[],
): Promise<Entity> {
  const {
    raw: [entity],
  } = await this.returning([
    'id',
    ...this.getInsertedColumns().map(({ propertyName }) => propertyName),
    ...(aditionalColumns || []),
  ]).execute();

  return entity;
}

InsertQueryBuilder.prototype.getEntity = getEntity;
