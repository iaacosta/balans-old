/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { useDispatch } from 'react-redux';
import { useApolloClient, ApolloClient } from '@apollo/client';
import { Dispatch, Action } from 'redux';
import { removeToken } from '../../slices/authSlice';

export const logoutHof = <A extends Action<any>, T extends object>(
  action: A,
  dispatch: Dispatch<A>,
  client: ApolloClient<T>,
) => async (): Promise<void> => {
  dispatch(action);
  if (localStorage.getItem('x-auth')) localStorage.removeItem('x-auth');
  await client.clearStore();
  await client.resetStore();
};

export const useLogout = (): (() => Promise<void>) => {
  const dispatch = useDispatch();
  const client = useApolloClient();
  return logoutHof(removeToken(), dispatch, client);
};
