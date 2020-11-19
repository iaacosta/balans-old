import React, { useMemo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Column } from 'react-table';
import { formatMoney } from 'accounting';
import clsx from 'clsx';
import { MyPassivesQuery } from '../../@types/graphql';
import EnhancedTable from '../ui/dataDisplay/EnhancedTable';
import { longDateFormatter } from '../../utils/date';
import { useLocale } from '../../hooks/utils/useLocale';
import PassiveActionCell from './PassiveActionCell';

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
  passives: MyPassivesQuery['passives'];
  loading: boolean;
  noAccountsCreated: boolean;
};

const PassivesTable: React.FC<Props> = ({ children, passives, loading, noAccountsCreated }) => {
  const classes = useStyles();
  const { locale } = useLocale();

  const columns: Column<MyPassivesQuery['passives'][number]>[] = useMemo(
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
        Header: locale('others:passiveStatus'),
        accessor: 'liquidated',
        Cell: ({ value }) =>
          value ? locale('others:passivePaid') : locale('others:passivePending'),
      },
      {
        Header: locale('movements:form:account'),
        accessor: 'account',
        Cell: ({ value }) => `${value.name} (${value.bank})`,
      },
      {
        Header: locale('elements:singular:liquidatedAccount'),
        accessor: 'liquidatedAccount',
        Cell: ({ value }) => (value ? `${value.name} (${value.bank})` : '-'),
      },
      {
        Header: locale('movements:form:memo'),
        accessor: 'memo',
        Cell: ({ value }) => value || '-',
      },
      {
        Header: locale('movements:form:issuedAt'),
        accessor: 'issuedAt',
        Cell: ({ value }) => longDateFormatter(value),
      },
      {
        Header: locale('tables:actions'),
        id: 'actions',
        Cell: PassiveActionCell,
      },
    ],
    [classes, locale],
  );

  return (
    <EnhancedTable
      className={classes.table}
      loading={loading}
      columns={columns}
      data={passives}
      initialState={{ pageSize: 7 }}
      noEntriesLabel={
        noAccountsCreated
          ? locale('movements:atLeastOneAccount')
          : locale('movements:noneCreated', { value: locale('elements:plural:passive') })
      }
    >
      {children}
    </EnhancedTable>
  );
};

export default PassivesTable;
