/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { makeStyles, Box, Paper, useTheme } from '@material-ui/core';
import { MyTransactionsQuery } from '../../@types/graphql';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import { useLocale } from '../../hooks/utils/useLocale';
import TransactionListItem from './TransactionListItem';

type Props = {
  transactions: MyTransactionsQuery['transactions'];
  loading: boolean;
  noAccountsCreated: boolean;
};

const useStyles = makeStyles(() => ({
  paper: { flex: 1 },
  container: { listStyle: 'none' },
}));

const TransactionsList: React.FC<Props> = ({ transactions, loading, noAccountsCreated }) => {
  const { locale } = useLocale();
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper className={classes.paper} elevation={1}>
      <VirtualizedList
        data={transactions}
        loading={loading}
        customItemHeight={theme.spacing(18)}
        noEntriesLabel={
          noAccountsCreated
            ? locale('movements:atLeastOneAccount')
            : locale('movements:noneCreated', { value: locale('elements:plural:transaction') })
        }
      >
        {({ data, index, style }) => (
          <Box style={style} key={index}>
            <TransactionListItem transaction={data[index]} />
          </Box>
        )}
      </VirtualizedList>
    </Paper>
  );
};

export default TransactionsList;
