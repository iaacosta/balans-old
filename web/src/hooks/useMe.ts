/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useQuery } from '@apollo/client';
import { meQuery } from '../graphql/authentication';
import { MeQueryVariables, MeQuery } from '../@types/graphql';

export const useMe = () => {
  const { data, error, loading } = useQuery<MeQuery, MeQueryVariables>(meQuery);
  return { user: data?.user, error, loading };
};
