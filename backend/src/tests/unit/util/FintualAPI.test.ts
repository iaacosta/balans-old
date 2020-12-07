/* eslint-disable prefer-promise-reject-errors */
import FintualAuthenticationError from '../../../graphql/errors/FintualAuthenticationError';
import FintualUnknownError from '../../../graphql/errors/FintualUnkownError';
import { FintualAPI } from '../../../utils/api';
import { mockAxiosGet } from '../../mocks/axios';

describe('FintualAPI tests', () => {
  it('should return goals', async () => {
    const testGoals = [1, 2];
    mockAxiosGet(() => Promise.resolve({ data: { data: testGoals } }));
    const api = new FintualAPI('sample@email.com', 'sampleToken');
    await expect(api.goals()).resolves.toEqual(testGoals);
  });

  it('should throw auth error if 401', async () => {
    mockAxiosGet(() => Promise.reject({ response: { status: 401 } }));
    const api = new FintualAPI('sample@email.com', 'sampleToken');
    await expect(api.goals()).rejects.toThrow(FintualAuthenticationError);
  });

  it('should throw apollo error if any other status', async () => {
    mockAxiosGet(() => Promise.reject({ response: { status: 450 } }));
    const api = new FintualAPI('sample@email.com', 'sampleToken');
    await expect(api.goals()).rejects.toThrow(FintualUnknownError);
  });
});
