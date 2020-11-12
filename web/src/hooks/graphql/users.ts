import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useIdMutation, useRedirectedQuery, useInputMutation } from './utils';
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
import {
  IdMutationTuple,
  InputMutationTuple,
  UpdateInputMutationFunction,
} from '../../@types/helpers';
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
    const response = await mutate({ id, ...values });
    if (!response) return;

    enqueueSnackbar(
      locale('snackbars:success:updated', { value: locale('elements:plural:user') }),
      { variant: 'success' },
    );

    if (callback) await callback();
  };

  return [updateUser, meta];
};

export const useRestoreUser = (): IdMutationTuple<RestoreUserMutation> => {
  const { locale } = useLocale();

  return useIdMutation<RestoreUserMutation>(restoreUserMutation, {
    refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }],
    successMessage: locale('snackbars:success:restored', {
      value: locale('elements:singular:user'),
    }),
  });
};

export const useDeleteUser = (): IdMutationTuple<DeleteUserMutation> => {
  const { locale } = useLocale();

  return useIdMutation<DeleteUserMutation>(deleteUserMutation, {
    refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }],
    successMessage: locale('snackbars:success:deleted', {
      value: locale('elements:singular:user'),
    }),
  });
};
