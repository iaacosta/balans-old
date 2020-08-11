import { InsertQueryBuilder } from 'typeorm/query-builder/InsertQueryBuilder';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import NotFoundError from '../graphql/errors/NotFoundError';

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

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    /**
     * Returns entity of the query result or throws the corresponding error
     * @returns the queried entity
     * @example queryBuilder.getOneOrFail()
     */
    getOneOrFail: typeof getOneOrFail;
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

async function getOneOrFail<Entity>(
  this: SelectQueryBuilder<Entity>,
): Promise<Entity> {
  const entity = await this.getOne();

  if (!entity) throw new NotFoundError();
  return entity;
}

InsertQueryBuilder.prototype.getEntity = getEntity;
SelectQueryBuilder.prototype.getOneOrFail = getOneOrFail;
