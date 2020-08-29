import React, { useMemo } from 'react';
import { makeStyles, Typography, Box } from '@material-ui/core';
import { Column } from 'react-table';
import { formatMoney } from 'accounting';
import dayjs from 'dayjs';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import { groupBy, mapValues } from 'lodash';
import { MyTransactionsQuery } from '../../@types/graphql';
import EnhancedTable from '../ui/dataDisplay/EnhancedTable';
import TransactionActionCell from './TransactionActionCell';

const useStyles = makeStyles((theme) => ({
  table: { flex: 1 },
  expense: { color: theme.palette.error.main },
  income: { color: theme.palette.success.main },
}));

type Props = {
  transactions: MyTransactionsQuery['transactions'];
  loading: boolean;
  noAccountsCreated: boolean;
};

export type ProcessedTransaction = MyTransactionsQuery['transactions'][number] & {
  resultantBalance: number;
};

const TransactionsTable: React.FC<Props> = ({
  children,
  transactions,
  loading,
  noAccountsCreated,
}) => {
  const classes = useStyles();

  /* TODO: lookup how to display loading if computing this */
  const processedTransactions = useMemo(() => {
    const withRunningBalance: ProcessedTransaction[] = [];
    const balances: { [key: string]: number } = mapValues(
      groupBy(transactions, (transaction) => transaction.account.id),
      (groupedTransactions) => groupedTransactions.reduce((accum, curr) => accum + curr.amount, 0),
    );

    transactions.forEach((transaction) => {
      withRunningBalance.push({
        ...transaction,
        resultantBalance: balances[transaction.account.id],
      });

      balances[transaction.account.id] -= transaction.amount;
    });

    return withRunningBalance;
  }, [transactions]);

  const columns: Column<ProcessedTransaction>[] = useMemo(
    () => [
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }) => formatMoney(value),
      },
      {
        Header: 'Account',
        accessor: 'account',
        Cell: ({ value }) => `${value.name} (${value.bank})`,
      },
      {
        Header: 'Memo',
        accessor: 'memo',
        Cell: ({ value }) => value || '-',
      },
      {
        Header: 'Resultant balance',
        accessor: 'resultantBalance',
        Cell: ({ value, row }) => {
          const cls = clsx(
            row.original.amount < 0 && classes.expense,
            row.original.amount > 0 && classes.income,
          );

          return (
            <Box display="flex" alignItems="center">
              {row.original.amount > 0 ? (
                <ArrowDropUpIcon className={cls} fontSize="small" />
              ) : (
                <ArrowDropDownIcon className={cls} fontSize="small" />
              )}
              <Typography variant="body2" className={cls}>
                {formatMoney(value)}
              </Typography>
            </Box>
          );
        },
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: ({ value }) => value?.name || 'None',
      },
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({ value }) => dayjs(value).format('HH:mm DD/MM/YYYY'),
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: TransactionActionCell,
      },
    ],
    [classes],
  );

  return (
    <EnhancedTable
      className={classes.table}
      loading={loading}
      columns={columns}
      data={processedTransactions}
      noEntriesLabel={
        noAccountsCreated
          ? 'You have no accounts yet, so no transactions can be shown or created '
          : 'No transactions created yet'
      }
    >
      {children}
    </EnhancedTable>
  );
};

export default TransactionsTable;
