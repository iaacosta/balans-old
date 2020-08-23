import React, { useMemo } from 'react';
import { Typography, makeStyles, Hidden, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import ViewportContainer from '../components/ui/ViewportContainer';
import { useRedirectedQuery } from '../hooks/graphql/useRedirectedQuery';
import { myAccountsQuery } from '../graphql/account';
import {
  MyAccountsQuery,
  MyTransactionsQuery,
  MyTransactionsQueryVariables,
} from '../@types/graphql';
import TransactionsTable from '../components/transactions/TransactionsTable';
import TransactionsList from '../components/transactions/TransactionsList';
import { myTransactionsQuery } from '../graphql/transaction';
import CreateTransactionDialog from '../components/transactions/CreateTransactionDialog';
import DialogButton from '../components/ui/DialogButton';

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
  const { data: transactionsData, loading: transactionsLoading } = useRedirectedQuery<
    MyTransactionsQuery,
    MyTransactionsQueryVariables
  >(myTransactionsQuery);

  const { data: accountsData, loading: accountsLoading } = useRedirectedQuery<MyAccountsQuery>(
    myAccountsQuery,
  );

  const transactions: MyTransactionsQuery['transactions'] = useMemo(
    () => transactionsData?.transactions || [],
    [transactionsData],
  );

  const noAccounts = accountsData?.accounts.length === 0;
  const loading = transactionsLoading || accountsLoading;
  const errored = (!accountsData || !transactionsData) && !loading;

  const Button = (
    <DialogButton
      disabled={errored || loading}
      buttonLabel="Add new transaction"
      DialogComponent={CreateTransactionDialog}
      data-testid="createTransactionButton"
      startIcon={<AddIcon />}
    />
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
