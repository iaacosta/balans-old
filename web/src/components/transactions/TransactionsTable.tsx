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

import { MyTransactionsQuery, MyTransactionsQueryVariables } from '../../@types/graphql';
import { useRedirectedQuery } from '../../hooks/useRedirectedQuery';
import { myTransactionsQuery } from '../../graphql/transaction';
import EnhancedTable from '../ui/EnhancedTable';
import TransactionActionCell from './TransactionActionCell';

const useStyles = makeStyles((theme) => ({
  table: { flex: 1 },
  expense: { color: theme.palette.error.main },
  income: { color: theme.palette.success.main },
}));

type Props = {
  accountsLoading: boolean;
  noAccountsCreated: boolean;
};

const TransactionsTable: React.FC<Props> = ({ children, accountsLoading, noAccountsCreated }) => {
  const classes = useStyles();
  const { data, loading } = useRedirectedQuery<MyTransactionsQuery, MyTransactionsQueryVariables>(
    myTransactionsQuery,
  );

  const transactions: MyTransactionsQuery['transactions'] = useMemo(
    () => data?.transactions || [],
    [data],
  );

  type Row = typeof transactions[number];
  const columns: Column<Row>[] = useMemo(
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
      loading={!data || loading || accountsLoading}
      columns={columns}
      data={transactions}
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
