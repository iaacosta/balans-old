import React from 'react';
import { Add as AddIcon } from '@material-ui/icons';
import { Hidden, Box, makeStyles } from '@material-ui/core';
import TransactionsTable from './TransactionsTable';
import TransactionsList from './TransactionsList';
import { useMyTransactions, useMyDebitAccounts } from '../../hooks/graphql';
import { useMyCategories } from '../../hooks/graphql/category';
import DialogButton from '../ui/dialogs/DialogButton';
import CreateTransactionDialog from './CreateTransactionDialog';
import { useLocale } from '../../hooks/utils/useLocale';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const Transactions: React.FC = () => {
  const classes = useStyles();
  const { locale } = useLocale();
  const { transactions, loading: transactionsLoading } = useMyTransactions();
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const { loading: loadingCategory } = useMyCategories();

  const noAccounts = accounts.length === 0;
  const loading = transactionsLoading || accountsLoading || loadingCategory;

  const Button = (
    <DialogButton
      disabled={loading || noAccounts}
      buttonLabel={locale('movements:create:transaction')}
      data-testid="createTransactionButton"
      startIcon={<AddIcon />}
    >
      <CreateTransactionDialog />
    </DialogButton>
  );

  return (
    <>
      <Hidden smDown>
        <TransactionsTable
          transactions={transactions}
          loading={loading}
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
    </>
  );
};

export default Transactions;
