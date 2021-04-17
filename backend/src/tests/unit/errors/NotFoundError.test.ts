import NotFoundError from '../../../graphql/errors/NotFoundError';

describe('NotFoundError test cases', () => {
  it('should throw error if argument given', () => {
    const testCase = () => {
      throw new NotFoundError('user');
    };

    expect(testCase).toThrow(NotFoundError);
  });

  it('should throw error if no argument given', () => {
    const testCase = () => {
      throw new NotFoundError();
    };

    expect(testCase).toThrow(NotFoundError);
  });
});
