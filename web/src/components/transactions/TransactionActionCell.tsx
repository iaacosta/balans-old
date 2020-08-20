import React from 'react';
import { CellProps } from 'react-table';
import { Box, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';

import {
  MyTransactionsQuery,
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables,
} from '../../@types/graphql';
import EnhancedIconButton from '../ui/EnhancedIconButton';
import { deleteTransactionMutation, myTransactionsQuery } from '../../graphql/transaction';
import { myAccountsQuery } from '../../graphql/account';

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
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteTransaction, { loading }] = useMutation<
    DeleteTransactionMutation,
    DeleteTransactionMutationVariables
  >(deleteTransactionMutation, {
    refetchQueries: [{ query: myTransactionsQuery }, { query: myAccountsQuery }],
  });

  const { id } = row.original;

  const handleDelete = async () => {
    try {
      await deleteTransaction({ variables: { id } });
      enqueueSnackbar('Transaction deleted successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  return (
    <Box className={classes.wrapper}>
      <EnhancedIconButton data-testid={`updateTransaction${id}`} disabled contained color="info">
        <EditIcon />
      </EnhancedIconButton>
      <EnhancedIconButton
        contained
        disabled={loading}
        data-testid={`deleteTransaction${id}`}
        onClick={handleDelete}
        color="error"
      >
        <DeleteIcon />
      </EnhancedIconButton>
    </Box>
  );
};

export default TransactionActionCell;
