import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';

import UniqueConstraintError from '../graphql/errors/UniqueConstraintError';
import NotFoundError from '../graphql/errors/NotFoundError';

const formatError = (error: GraphQLError): GraphQLFormattedError<any> => {
  const { originalError } = error;

  if (originalError) {
    if (
      originalError.name === 'QueryFailedError' &&
      error.message.includes('unique')
    ) {
      return new UniqueConstraintError(originalError);
    }

    if (originalError.name === 'EntityNotFound') {
      return new NotFoundError(originalError);
    }

    if (
      originalError.name === 'Error' &&
      originalError.message.includes('Access denied')
    ) {
      return new AuthenticationError(
        "you don't have enough access to perform this action",
      );
    }
  }

  return error;
};

export default formatError;
