/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { makeStyles, Box, Paper, useTheme } from '@material-ui/core';
import { MyTransfersQuery } from '../../@types/graphql';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import { useLocale } from '../../hooks/utils/useLocale';
import TransferListItem from './TransferListItem';

type Props = {
  transfers: MyTransfersQuery['transfers'];
  loading: boolean;
  notEnoughAccounts: boolean;
};

const useStyles = makeStyles((theme) => ({
  paper: { flex: 1 },
  container: { listStyle: 'none' },
  icon: { color: theme.palette.action.disabled },
  secondaryActions: {
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
  transfer: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const TransfersList: React.FC<Props> = ({ transfers, loading, notEnoughAccounts }) => {
  const classes = useStyles();
  const { locale } = useLocale();
  const theme = useTheme();

  return (
    <Paper className={classes.paper} square elevation={1}>
      <VirtualizedList
        data={transfers}
        loading={loading}
        customItemHeight={theme.spacing(18)}
        noEntriesLabel={
          notEnoughAccounts
            ? locale('movements:atLeastTwoAccounts')
            : locale('movements:noneCreated', { value: locale('elements:plural:transfer') })
        }
      >
        {({ data, index, style }) => (
          <Box style={style} key={index}>
            <TransferListItem transfer={data[index]} />
          </Box>
        )}
      </VirtualizedList>
    </Paper>
  );
};

export default TransfersList;
