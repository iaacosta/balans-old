import React from 'react';
import { CellProps } from 'react-table';
import { Box, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { useToggleable } from '../../hooks/utils/useToggleable';
import { AllUsersQuery } from '../../@types/graphql';
import { roles } from '../../utils/rbac';
import EnhancedIconButton from '../ui/EnhancedIconButton';
import UpdateUserDialog from './UpdateUserDialog';
import { useDeleteUser } from '../../hooks/graphql/useDeleteUser';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(2) },
  },
}));

const ActiveActionsCell: React.FC<CellProps<AllUsersQuery['users'][number], void>> = ({ row }) => {
  const { toggled, set } = useToggleable();
  const classes = useStyles();
  const [deleteUser, { loading: deleteLoading }] = useDeleteUser();

  const { role, id } = row.original;

  return (
    <Box className={classes.wrapper}>
      <EnhancedIconButton
        data-testid={`updateUser${id}`}
        onClick={() => set(true)}
        contained
        color="info"
      >
        <EditIcon />
      </EnhancedIconButton>
      <UpdateUserDialog open={toggled} onClose={() => set(false)} user={row.original} />
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
