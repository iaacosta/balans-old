import React from 'react';
import { CellProps } from 'react-table';
import { Box, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import { MyTransactionsQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import { useDeleteTransaction } from '../../hooks/graphql';
import DialogIconButton from '../ui/dialogs/DialogIconButton';
import UpdateTransactionDialog from './UpdateTransactionDialog';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(2) },
  },
}));

const TransactionActionCell: React.FC<CellProps<MyTransactionsQuery['transactions'][number]>> = ({
  row,
}) => {
  const [deleteTransaction, { loading }] = useDeleteTransaction();
  const classes = useStyles();
  const { id } = row.original;

  return (
    <Box className={classes.wrapper}>
      <DialogIconButton
        data-testid={`updateTransaction${id}`}
        icon={<EditIcon />}
        contained
        color="info"
      >
        <UpdateTransactionDialog transaction={row.original} />
      </DialogIconButton>
      <EnhancedIconButton
        contained
        disabled={loading}
        data-testid={`deleteTransaction${id}`}
        onClick={() => deleteTransaction(id)}
        color="error"
      >
        <DeleteIcon />
      </EnhancedIconButton>
    </Box>
  );
};

export default TransactionActionCell;
