import React from 'react';
import { CellProps } from 'react-table';
import { Box, makeStyles } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { usersQuery, deleteUserMutation, deletedUsersQuery } from '../../graphql/users';
import {
  AllUsersQuery,
  DeleteUserMutation,
  DeleteUserMutationVariables,
} from '../../@types/graphql';
import { roles } from '../../utils/rbac';
import EnhancedIconButton from '../ui/EnhancedIconButton';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(2) },
  },
}));

const ActiveActionsCell: React.FC<CellProps<AllUsersQuery['users'][number], void>> = ({ row }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const [deleteUser, { loading: deleteLoading }] = useMutation<
    DeleteUserMutation,
    DeleteUserMutationVariables
  >(deleteUserMutation, { refetchQueries: [{ query: usersQuery }, { query: deletedUsersQuery }] });

  const { role, id } = row.original;
  const handleDelete = async () => {
    try {
      await deleteUser({ variables: { id } });
      enqueueSnackbar('User deleted succesfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  return (
    <Box className={classes.wrapper}>
      <EnhancedIconButton contained color="info">
        <EditIcon />
      </EnhancedIconButton>
      <EnhancedIconButton
        contained
        color="error"
        disabled={deleteLoading || role === roles.ADMIN}
        onClick={() => handleDelete()}
      >
        <DeleteIcon />
      </EnhancedIconButton>
    </Box>
  );
};

export default ActiveActionsCell;
