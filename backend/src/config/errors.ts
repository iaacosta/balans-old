import { GraphQLError, GraphQLFormattedError } from 'graphql';
import UniqueConstraintError from '../graphql/errors/UniqueConstraintError';
import NotFoundError from '../graphql/errors/NotFoundError';

const formatError = (error: GraphQLError): GraphQLFormattedError<any> => {
  const { originalError } = error;

  if (originalError) {
    if (
      originalError.name === 'QueryFailedError' &&
      error.message.includes('unique')
    ) {
      throw new UniqueConstraintError(originalError);
    }

    if (originalError.name === 'EntityNotFound') {
      throw new NotFoundError(originalError);
    }
  }

  return error;
};

export default formatError;
