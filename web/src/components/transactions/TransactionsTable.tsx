import React, { useMemo } from 'react';
import { makeStyles, Typography, Box } from '@material-ui/core';
import { Column } from 'react-table';
import { formatMoney } from 'accounting';
import clsx from 'clsx';
import { MyTransactionsQuery } from '../../@types/graphql';
import EnhancedTable from '../ui/dataDisplay/EnhancedTable';
import TransactionActionCell from './TransactionActionCell';
import CategoryIcon from '../ui/misc/CategoryIcon';
import { longDateFormatter } from '../../utils/date';
import { useLocale } from '../../hooks/utils/useLocale';

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
  const { locale } = useLocale();

  const columns: Column<MyTransactionsQuery['transactions'][number]>[] = useMemo(
    () => [
      {
        Header: locale('movements:form:amount'),
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
        Header: locale('movements:form:account'),
        accessor: 'account',
        Cell: ({ value }) => `${value.name} (${value.bank})`,
      },
      {
        Header: locale('movements:form:memo'),
        accessor: 'memo',
        Cell: ({ value }) => value || '-',
      },
      {
        Header: locale('movements:form:category'),
        accessor: 'category',
        Cell: ({ value }) => (
          <Box className={classes.categoryWrapper}>
            <CategoryIcon color={value?.color} />
            <Typography variant="body2">{value?.name || 'None'}</Typography>
          </Box>
        ),
      },
      {
        Header: locale('movements:form:issuedAt'),
        accessor: 'issuedAt',
        Cell: ({ value }) => longDateFormatter(value),
      },
      {
        Header: locale('tables:actions'),
        id: 'actions',
        Cell: TransactionActionCell,
      },
    ],
    [classes, locale],
  );

  return (
    <EnhancedTable
      className={classes.table}
      loading={loading}
      columns={columns}
      data={transactions}
      initialState={{ pageSize: 8 }}
      noEntriesLabel={
        noAccountsCreated
          ? locale('movements:atLeastOneAccount')
          : locale('movements:noTransactionsCreated')
      }
    >
      {children}
    </EnhancedTable>
  );
};

export default TransactionsTable;
