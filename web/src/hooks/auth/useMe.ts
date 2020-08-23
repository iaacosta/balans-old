/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { meQuery } from '../../graphql/authentication';
import { MeQueryVariables, MeQuery } from '../../@types/graphql';
import { useLogout } from './useLogout';

export const useMe = () => {
  const { data, error, loading } = useQuery<MeQuery, MeQueryVariables>(meQuery);
  const { enqueueSnackbar } = useSnackbar();
  const logout = useLogout();

  useEffect(() => {
    if (error) {
      logout().then(() => {
        enqueueSnackbar('There was an error identifying you, please login again', {
          variant: 'error',
        });
      });
    }
  }, [error, logout, enqueueSnackbar]);

  return { user: data?.user, error, loading };
};
