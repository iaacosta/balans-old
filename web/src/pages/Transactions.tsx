import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import ViewportContainer from '../components/ui/ViewportContainer';
import DialogButton from '../components/ui/DialogButton';
import CreateTransactionDialog from '../components/transactions/CreateTransactionDialog';
import TransactionsTable from '../components/transactions/TransactionsTable';
import { useRedirectedQuery } from '../hooks/useRedirectedQuery';
import { myAccountsQuery } from '../graphql/account';
import { MyAccountsQuery } from '../@types/graphql';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
}));

const Transactions: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useRedirectedQuery<MyAccountsQuery>(myAccountsQuery);

  const noAccountsCreated = !!data && data.accounts.length === 0;
  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        My transactions
      </Typography>
      <TransactionsTable accountsLoading={loading || !data} noAccountsCreated={noAccountsCreated}>
        <DialogButton
          disabled={loading || noAccountsCreated}
          buttonLabel="Add new transaction"
          DialogComponent={CreateTransactionDialog}
          data-testid="createTransactionButton"
          startIcon={<AddIcon />}
        />
      </TransactionsTable>
    </ViewportContainer>
  );
};

export default Transactions;
