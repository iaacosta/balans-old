import React from 'react';
import { CellProps } from 'react-table';
import { Box, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { AllUsersQuery } from '../../@types/graphql';
import { roles } from '../../utils/rbac';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import UpdateUserDialog from './UpdateUserDialog';
import { useDeleteUser } from '../../hooks/graphql/useDeleteUser';
import DialogIconButton from '../ui/dialogs/DialogIconButton';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(2) },
  },
}));

const ActiveActionsCell: React.FC<CellProps<AllUsersQuery['users'][number], void>> = ({ row }) => {
  const classes = useStyles();
  const [deleteUser, { loading: deleteLoading }] = useDeleteUser();

  const { role, id } = row.original;

  return (
    <Box className={classes.wrapper}>
      <DialogIconButton
        data-testid={`updateUser${id}`}
        DialogProps={{ user: row.original }}
        DialogComponent={UpdateUserDialog}
        contained
        color="info"
      >
        <EditIcon />
      </DialogIconButton>
      <EnhancedIconButton
        contained
        data-testid={`deleteUser${id}`}
        color="error"
        disabled={deleteLoading || role === roles.ADMIN}
        onClick={() => deleteUser(id)}
      >
        <DeleteIcon />
      </EnhancedIconButton>
    </Box>
  );
};

export default ActiveActionsCell;
