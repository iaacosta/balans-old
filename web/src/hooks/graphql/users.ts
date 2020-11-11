import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useIdMutation, UseIdMutationReturn, useRedirectedQuery, useInputMutation } from './utils';
import {
  DeleteUserMutation,
  RestoreUserMutation,
  AllUsersQuery,
  AllUsersQueryVariables,
  AllDeletedUsersQuery,
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from '../../@types/graphql';
import {
  deleteUserMutation,
  usersQuery,
  deletedUsersQuery,
  restoreUserMutation,
  updateUserMutation,
} from './queries';
import { InputMutationTuple, UpdateInputMutationFunction } from '../../@types/helpers';
import { handleError } from '../../utils/errors';
import { useLocale } from '../utils/useLocale';

export const useAllActiveUsers = (): Omit<
  QueryResult<AllUsersQuery, AllUsersQueryVariables>,
  'data'
> & {
  users: AllUsersQuery['users'];
} => {
  const { data, loading, ...meta } = useRedirectedQuery(usersQuery);
  const users = useMemo(() => data?.users || [], [data]);
  return { users, loading: loading || !data, ...meta };
};

export const useAllDeletedUsers = (): Omit<
  QueryResult<AllDeletedUsersQuery, AllDeletedUsersQuery>,
  'data'
> & {
  users: AllDeletedUsersQuery['users'];
} => {
  const { data, loading, ...meta } = useRedirectedQuery(deletedUsersQuery);
  const users = useMemo(() => data?.users || [], [data]);
  return { users, loading: loading || !data, ...meta };
};

type UseUpdateUserMutationReturn = InputMutationTuple<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;

type UseUpdateUserReturn = [
  UpdateInputMutationFunction<UpdateUserMutationVariables['input']>,
  UseUpdateUserMutationReturn[1],
];

export const useUpdateUser = (): UseUpdateUserReturn => {
  const { enqueueSnackbar } = useSnackbar();
  const { locale } = useLocale();
  const [mutate, meta]: UseUpdateUserMutationReturn = useInputMutation(updateUserMutation);

  const updateUser: UseUpdateUserReturn[0] = async (id, values, callback) => {
    try {
      await mutate({ id, ...values });

      enqueueSnackbar(
        locale('snackbars:success:updated', { value: locale('elements:plural:user') }),
        { variant: 'success' },
      );

      if (callback) await callback();
    } catch (err) {
      handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
    }
  };

  return [updateUser, meta];
};

export const useRestoreUser = (): UseIdMutationReturn<RestoreUserMutation> => {
  const { locale } = useLocale();

  return useIdMutation<RestoreUserMutation>(restoreUserMutation, {
    refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }],
    snackbarMessage: locale('snackbars:success:restored', {
      value: locale('elements:singular:user'),
    }),
  });
};

export const useDeleteUser = (): UseIdMutationReturn<DeleteUserMutation> => {
  const { locale } = useLocale();

  return useIdMutation<DeleteUserMutation>(deleteUserMutation, {
    refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }],
    snackbarMessage: locale('snackbars:success:deleted', {
      value: locale('elements:singular:user'),
    }),
  });
};
