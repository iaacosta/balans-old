import { AuthenticationError } from 'apollo-server-express';
import formatError from '../../../errors/apolloErrorFormatter';
import UniqueConstraintError from '../../../graphql/errors/UniqueConstraintError';

describe('formatError', () => {
  it('should return same error if not handled', () => {
    const error = formatError({} as any);
    expect(error).toMatchObject({});
  });

  describe('UniqueConstraintError', () => {
    it('should return correct error if unique constraint', () => {
      const error = formatError({
        message: 'unique',
        originalError: {
          name: 'QueryFailedError',
          table: 'mockTable',
          detail: 'Key (mockColumn)=(value)',
        },
      } as any);

      expect(error).toBeInstanceOf(UniqueConstraintError);
      expect(error.message.includes('mockColumn')).toBe(true);
      expect(error.message.includes('mockTable')).toBe(true);
    });

    it('should return correct error if incorrect detail', () => {
      const error = formatError({
        message: 'unique',
        originalError: {
          name: 'QueryFailedError',
          table: 'mock',
          detail: 'noop',
        },
      } as any);

      expect(error).toBeInstanceOf(UniqueConstraintError);
      expect(error.message.includes('column')).toBe(true);
    });

    it('should return correct error if no detail', () => {
      const error = formatError({
        message: 'unique',
        originalError: {
          name: 'QueryFailedError',
          table: 'mock',
        },
      } as any);

      expect(error).toBeInstanceOf(UniqueConstraintError);
      expect(error.message.includes('column')).toBe(true);
    });
  });

  describe('AuthenticationError', () => {
    it('should return correct error if unauthorized', () => {
      expect(
        formatError({
          originalError: { name: 'Error', message: 'Access denied' },
        } as any),
      ).toBeInstanceOf(AuthenticationError);
    });
  });
});
