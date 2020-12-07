/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';

export const mockAxiosGet = (
  responseImplementation: () => any,
): jest.SpyInstance => {
  const spy = jest.spyOn(axios, 'get');
  spy.mockImplementation(responseImplementation);
  return spy;
};
