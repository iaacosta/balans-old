import React from 'react';
import { CellProps } from 'react-table';
import { Box, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon, Payment as PaymentIcon } from '@material-ui/icons';

import { MyPassivesQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import DialogIconButton from '../ui/dialogs/DialogIconButton';
import LiquidatePassiveDialog from './LiquidatePassiveDialog';
import { useDeletePassive } from '../../hooks/graphql';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(2) },
  },
}));

const PassiveActionCell: React.FC<CellProps<MyPassivesQuery['passives'][number]>> = ({ row }) => {
  const classes = useStyles();
  const [deletePassive, { loading }] = useDeletePassive();
  const { id, liquidated } = row.original;

  return (
    <Box className={classes.wrapper}>
      {!liquidated && (
        <DialogIconButton
          contained
          data-testid={`liquidatePassive${id}`}
          color="warning"
          icon={<PaymentIcon />}
        >
          <LiquidatePassiveDialog passive={row.original} />
        </DialogIconButton>
      )}
      <EnhancedIconButton contained disabled data-testid={`updatePassive${id}`} color="info">
        <EditIcon />
      </EnhancedIconButton>
      <EnhancedIconButton
        contained
        disabled={loading}
        data-testid={`deletePassive${id}`}
        color="error"
        onClick={() => deletePassive(row.original.id)}
      >
        <DeleteIcon />
      </EnhancedIconButton>
    </Box>
  );
};

export default PassiveActionCell;
