/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {
  ListItem,
  ListItemText,
  makeStyles,
  Divider,
  ListItemSecondaryAction,
  Box,
  Paper,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { formatMoney } from 'accounting';
import clsx from 'clsx';
import { MyTransactionsQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import { useDeleteTransaction } from '../../hooks/graphql/useDeleteTransaction';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import DialogIconButton from '../ui/dialogs/DialogIconButton';
import UpdateTransactionDialog from './UpdateTransactionDialog';

type Props = {
  transactions: MyTransactionsQuery['transactions'];
  loading: boolean;
  noAccountsCreated: boolean;
};

const useStyles = makeStyles((theme) => ({
  paper: { flex: 1 },
  container: { listStyle: 'none' },
  expense: { color: theme.palette.error.main },
  income: { color: theme.palette.success.main },
  secondaryActions: {
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const TransactionsList: React.FC<Props> = ({ transactions, loading, noAccountsCreated }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={1}>
      <VirtualizedList
        data={transactions}
        loading={loading}
        noEntriesLabel={
          noAccountsCreated
            ? 'You have no accounts yet, so no transactions can be shown or created'
            : 'No transactions created yet'
        }
      >
        {({ data, index, style }) => {
          const [deleteTransaction, { loading: deleteLoading }] = useDeleteTransaction();
          const { id, amount, account } = data[index];
          const cls = clsx(amount > 0 && classes.income, amount < 0 && classes.expense);
          return (
            <Box style={style} key={index}>
              <ListItem classes={{ container: classes.container }} component="div">
                <ListItemText
                  className={cls}
                  primary={formatMoney(amount)}
                  secondary={`${account.name} (${account.bank})`}
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                  <DialogIconButton
                    data-testid={`updateTransaction${id}`}
                    DialogProps={{ transaction: data[index] }}
                    DialogComponent={UpdateTransactionDialog}
                    contained
                    color="info"
                  >
                    <EditIcon />
                  </DialogIconButton>
                  <EnhancedIconButton
                    onClick={() => deleteTransaction(id)}
                    contained
                    disabled={deleteLoading}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </EnhancedIconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="middle" />
            </Box>
          );
        }}
      </VirtualizedList>
    </Paper>
  );
};

export default TransactionsList;
