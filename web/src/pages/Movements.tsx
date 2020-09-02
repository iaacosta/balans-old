import React from 'react';
import { Typography, makeStyles, Hidden, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import { useMyDebitAccounts, useMyTransactions } from '../hooks/graphql';
import TransactionsTable from '../components/transactions/TransactionsTable';
import TransactionsList from '../components/transactions/TransactionsList';
import CreateTransactionDialog from '../components/transactions/CreateTransactionDialog';
import DialogButton from '../components/ui/dialogs/DialogButton';
import { useMyCategories } from '../hooks/graphql/category';
import CustomTabs from '../components/ui/navigation/CustomTabs';
import { useTabs } from '../hooks/utils/useTabs';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const tabs = [
  { key: 'transactions' as const, label: 'Transactions' },
  { key: 'transfers' as const, label: 'Transfers' },
  { key: 'passive' as const, label: 'Passive transactions' },
];

const Movements: React.FC = () => {
  const classes = useStyles();
  const { transactions, loading: transactionsLoading } = useMyTransactions();
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const { loading: loadingCategory } = useMyCategories();
  const { selected, change } = useTabs({
    tabs: tabs.map(({ key }) => key),
    initialTab: 'transactions',
  });

  const noAccounts = accounts.length === 0;
  const loading = transactionsLoading || accountsLoading || loadingCategory;

  const Button = (
    <DialogButton
      disabled={loading || noAccounts}
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
        My movements
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      {selected === 'transactions' && (
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
      )}
    </ViewportContainer>
  );
};

export default Movements;
