import React from 'react';
import { CellProps } from 'react-table';
import { Restore as RestoreIcon } from '@material-ui/icons';

import { AllUsersQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/EnhancedIconButton';
import { useRestoreUser } from '../../hooks/graphql/useRestoreUser';

const DeletedActionsCell: React.FC<CellProps<AllUsersQuery['users'][number], void>> = ({ row }) => {
  const { id } = row.original;
  const [restoreUser, { loading: restoreLoading }] = useRestoreUser();

  return (
    <EnhancedIconButton
      contained
      color="success"
      data-testid={`restoreUser${id}`}
      disabled={restoreLoading}
      onClick={() => restoreUser(id)}
    >
      <RestoreIcon />
    </EnhancedIconButton>
  );
};

export default DeletedActionsCell;
