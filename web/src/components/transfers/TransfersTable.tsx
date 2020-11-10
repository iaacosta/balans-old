import React, { useMemo } from 'react';
import { makeStyles, Typography, Box } from '@material-ui/core';
import { Column, CellProps } from 'react-table';
import { formatMoney } from 'accounting';
import { TrendingFlat as TransferIcon } from '@material-ui/icons';
import { MyTransfersQuery } from '../../@types/graphql';
import EnhancedTable from '../ui/dataDisplay/EnhancedTable';
import TransferActionCell from './TransferActionCell';
import { longDateFormatter } from '../../utils/date';
import { useLocale } from '../../hooks/utils/useLocale';

const useStyles = makeStyles((theme) => ({
  table: { flex: 1 },
  amount: { color: theme.palette.info.main },
  transfer: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
  icon: { color: theme.palette.action.disabled },
}));

type Props = {
  transfers: MyTransfersQuery['transfers'];
  loading: boolean;
  notEnoughAccounts: boolean;
};

type CustomCellProps = CellProps<MyTransfersQuery['transfers'][number]>;

const TransfersTable: React.FC<Props> = ({ children, transfers, loading, notEnoughAccounts }) => {
  const classes = useStyles();
  const { locale } = useLocale();

  const columns: Column<MyTransfersQuery['transfers'][number]>[] = useMemo(
    () => [
      {
        Header: locale('movements:form:amount'),
        id: 'amount',
        Cell: ({ row }: CustomCellProps) => (
          <Typography variant="body2" className={classes.amount}>
            {formatMoney(row.original.to.amount)}
          </Typography>
        ),
      },
      {
        Header: locale('movements:transfer'),
        id: 'transfer',
        Cell: ({ row }: CustomCellProps) => (
          <Box className={classes.transfer}>
            <Typography variant="body2">{row.original.from.account.name}</Typography>
            <TransferIcon className={classes.icon} />
            <Typography variant="body2">{row.original.to.account.name}</Typography>
          </Box>
        ),
      },
      {
        Header: locale('movements:form:memo'),
        id: 'memo',
        Cell: ({ row }: CustomCellProps) => row.original.from.memo || '-',
      },
      {
        Header: locale('movements:form:issuedAt'),
        id: 'issuedAt',
        Cell: ({ row }: CustomCellProps) => longDateFormatter(row.original.from.issuedAt),
      },
      {
        Header: locale('tables:actions'),
        id: 'actions',
        Cell: TransferActionCell,
      },
    ],
    [classes, locale],
  );

  return (
    <EnhancedTable
      className={classes.table}
      loading={loading}
      columns={columns}
      data={transfers}
      initialState={{ pageSize: 8 }}
      noEntriesLabel={
        notEnoughAccounts
          ? locale('movements:atLeastTwoAccounts')
          : locale('movements:noTransfersCreated')
      }
    >
      {children}
    </EnhancedTable>
  );
};

export default TransfersTable;
