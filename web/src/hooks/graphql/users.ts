import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
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
import { InputMutationTuple } from '../../@types/helpers';

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

export const useUpdateUser = (): InputMutationTuple<
  UpdateUserMutation,
  UpdateUserMutationVariables
> => useInputMutation(updateUserMutation);

export const useRestoreUser = (): UseIdMutationReturn<RestoreUserMutation> => {
  return useIdMutation<RestoreUserMutation>(restoreUserMutation, {
    refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }],
    snackbarMessage: 'User restored successfully',
  });
};

export const useDeleteUser = (): UseIdMutationReturn<DeleteUserMutation> => {
  return useIdMutation<DeleteUserMutation>(deleteUserMutation, {
    refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }],
    snackbarMessage: 'User deleted successfully',
  });
};
