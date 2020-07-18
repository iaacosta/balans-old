import { prependAToResource } from '../../../graphql/errors/NotFoundError';

describe('prependAToResource', () => {
  it("should prepend 'an'", () => {
    expect(prependAToResource('user')).toBe('an user');
  });

  it("should prepend 'a'", () => {
    expect(prependAToResource('skeleton')).toBe('a skeleton');
  });
});
