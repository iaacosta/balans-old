import { GraphQLError, GraphQLFormattedError } from 'graphql';
import UniqueConstraintError from '../graphql/errors/UniqueConstraintError';

export const formatError = (
  error: GraphQLError,
): GraphQLFormattedError<any> => {
  if (error.message.includes('unique'))
    throw new UniqueConstraintError(error.originalError);

  return error;
};
