import React, { useMemo } from 'react';
import { makeStyles, Typography, Box } from '@material-ui/core';
import { Column } from 'react-table';
import { formatMoney } from 'accounting';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { MyTransactionsQuery } from '../../@types/graphql';
import EnhancedTable from '../ui/dataDisplay/EnhancedTable';
import TransactionActionCell from './TransactionActionCell';
import CategoryIcon from '../ui/misc/CategoryIcon';

const useStyles = makeStyles((theme) => ({
  table: { flex: 1 },
  expense: { color: theme.palette.error.main },
  income: { color: theme.palette.success.main },
  categoryWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(0.5) },
  },
}));

type Props = {
  transactions: MyTransactionsQuery['transactions'];
  loading: boolean;
  noAccountsCreated: boolean;
};

const TransactionsTable: React.FC<Props> = ({
  children,
  transactions,
  loading,
  noAccountsCreated,
}) => {
  const classes = useStyles();

  const columns: Column<MyTransactionsQuery['transactions'][number]>[] = useMemo(
    () => [
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }) => (
          <Typography
            className={clsx(value < 0 && classes.expense, value > 0 && classes.income)}
            variant="body2"
          >
            {formatMoney(value)}
          </Typography>
        ),
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
        Header: 'Category',
        accessor: 'category',
        Cell: ({ value }) => (
          <Box className={classes.categoryWrapper}>
            <CategoryIcon color={value?.color} />
            <Typography variant="body2">{value?.name || 'None'}</Typography>
          </Box>
        ),
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
      data={transactions}
      initialState={{ pageSize: 7 }}
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
