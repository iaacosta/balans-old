import { useIdMutation, UseIdMutationReturn } from './useIdMutation';
import { DeleteUserMutation } from '../../@types/graphql';
import { deleteUserMutation, usersQuery, deletedUsersQuery } from '../../graphql/users';

export const useDeleteUser = (): UseIdMutationReturn<DeleteUserMutation> => {
  return useIdMutation<DeleteUserMutation>(deleteUserMutation, {
    refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }],
    snackbarMessage: 'User deleted successfully',
  });
};
