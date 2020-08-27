import React from 'react';
import { Typography, makeStyles, Hidden, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import { useMyDebitAccounts, useMyTransactions } from '../hooks/graphql';
import TransactionsTable from '../components/transactions/TransactionsTable';
import TransactionsList from '../components/transactions/TransactionsList';
import CreateTransactionDialog from '../components/transactions/CreateTransactionDialog';
import DialogButton from '../components/ui/dialogs/DialogButton';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const Transactions: React.FC = () => {
  const classes = useStyles();
  const { transactions, loading: transactionsLoading } = useMyTransactions();
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();

  const noAccounts = accounts.length === 0;
  const loading = transactionsLoading || accountsLoading;
  const errored = !loading;

  const Button = (
    <DialogButton
      disabled={errored || loading || noAccounts}
      buttonLabel="Add new transaction"
      data-testid="createTransactionButton"
      startIcon={<AddIcon />}
    >
      <CreateTransactionDialog />
    </DialogButton>
  );

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        My transactions
      </Typography>
      <Hidden smDown>
        <TransactionsTable
          transactions={transactions}
          loading={errored || loading}
          noAccountsCreated={noAccounts}
        >
          {Button}
        </TransactionsTable>
      </Hidden>
      <Hidden mdUp>
        <TransactionsList
          transactions={transactions}
          loading={loading}
          noAccountsCreated={noAccounts}
        />
        <Box className={classes.buttonWrapper}>{Button}</Box>
      </Hidden>
    </ViewportContainer>
  );
};

export default Transactions;
