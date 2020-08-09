import React from 'react';
import { CellProps } from 'react-table';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Restore as RestoreIcon } from '@material-ui/icons';

import { usersQuery, restoreUserMutation, deletedUsersQuery } from '../../graphql/users';
import {
  AllUsersQuery,
  RestoreUserMutation,
  RestoreUserMutationVariables,
} from '../../@types/graphql';
import EnhancedIconButton from '../ui/EnhancedIconButton';

const DeletedActionsCell: React.FC<CellProps<AllUsersQuery['users'][number], void>> = ({ row }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [restoreUser, { loading: restoreLoading }] = useMutation<
    RestoreUserMutation,
    RestoreUserMutationVariables
  >(restoreUserMutation, { refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }] });

  const { id } = row.original;
  const handleRestore = async () => {
    try {
      await restoreUser({ variables: { id } });
      enqueueSnackbar('User restored succesfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  return (
    <EnhancedIconButton
      contained
      color="success"
      data-testid={`restoreUser${id}`}
      disabled={restoreLoading}
      onClick={() => handleRestore()}
    >
      <RestoreIcon />
    </EnhancedIconButton>
  );
};

export default DeletedActionsCell;
