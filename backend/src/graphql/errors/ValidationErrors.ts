import { ApolloError } from 'apollo-server-express';
import { ValidationError } from 'class-validator';
import { keyBy, mapValues, map } from 'lodash';

export default class ValidationErrors extends ApolloError {
  constructor(resource: string, validationErrors: ValidationError[]) {
    const fields = mapValues(
      keyBy(validationErrors, ({ property }) => property),
      ({ constraints }) => map(constraints, (value) => value),
    );

    super(
      `there were problems on validating the ${resource}`,
      'VALIDATION_ERROR',
      { fields },
    );
  }
}
