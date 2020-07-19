/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@apollo/client';
import { meQuery } from '../graphql/authentication';

type User = { id: number; name: string; username: string; role: string };

export const useMe = () => {
  const { data, error, loading } = useQuery<{ user: User }>(meQuery);
  return { user: data?.user, error, loading };
};
