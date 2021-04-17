import { AuthenticationError } from 'apollo-server-express';
import formatError from '../../../errors/apolloErrorFormatter';
import UniqueConstraintError from '../../../graphql/errors/UniqueConstraintError';
import NotFoundError from '../../../graphql/errors/NotFoundError';

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
      expect(error.message).toContain('Mock Column');
      expect(error.message).toContain('mockTable');
    });

    it('should return correct error if unique constraint with multiple columns', () => {
      const error = formatError({
        message: 'unique',
        originalError: {
          name: 'QueryFailedError',
          table: 'mockTable',
          detail: 'Key (testColumn, mockColumn)=(value)',
        },
      } as any);

      expect(error).toBeInstanceOf(UniqueConstraintError);
      expect(error.message).toContain('Test Column');
      expect(error.message).toContain('Mock Column');
      expect(error.message).toContain('mockTable');
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
      expect(error.message).toContain('column');
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
      expect(error.message).toContain('column');
    });
  });

  describe('NotFoundError', () => {
    it('should return correct error if entity not found', () => {
      const error = formatError({
        originalError: {
          name: 'EntityNotFound',
          message: 'Example "Mock" matching.',
        },
      } as any);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toContain('mock');
      expect(error.message).not.toContain('resource');
    });

    it('should return correct error if incorrect original error message', () => {
      const error = formatError({
        originalError: {
          name: 'EntityNotFound',
          message: 'noop',
        },
      } as any);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toContain('resource');
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
