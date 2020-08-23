import { useIdMutation, UseIdMutationReturn } from './useIdMutation';
import { RestoreUserMutation } from '../../@types/graphql';
import { restoreUserMutation, usersQuery, deletedUsersQuery } from '../../graphql/users';

export const useRestoreUser = (): UseIdMutationReturn<RestoreUserMutation> => {
  return useIdMutation<RestoreUserMutation>(restoreUserMutation, {
    refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }],
    snackbarMessage: 'User restored successfully',
  });
};
