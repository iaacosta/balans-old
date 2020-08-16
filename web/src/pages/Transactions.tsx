import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import ViewportContainer from '../components/ui/ViewportContainer';
import DialogButton from '../components/ui/DialogButton';
import CreateTransactionDialog from '../components/transactions/CreateTransactionDialog';
import TransactionsTable from '../components/transactions/TransactionsTable';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
}));

const Transactions: React.FC = () => {
  const classes = useStyles();

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        My transactions
      </Typography>
      <TransactionsTable>
        <DialogButton
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
