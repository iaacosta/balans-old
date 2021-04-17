/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { makeStyles, Box, Paper, useTheme } from '@material-ui/core';
import { MyPassivesQuery } from '../../@types/graphql';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import { useLocale } from '../../hooks/utils/useLocale';
import PassiveListItem from './PassiveListItem';

type Props = {
  passives: MyPassivesQuery['passives'];
  loading: boolean;
  noAccountsCreated: boolean;
};

const useStyles = makeStyles((theme) => ({
  paper: { flex: 1 },
  container: { listStyle: 'none' },
  expense: { color: theme.palette.error.main },
  income: { color: theme.palette.success.main },
  secondaryActions: {
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const PassivesList: React.FC<Props> = ({ passives, loading, noAccountsCreated }) => {
  const { locale } = useLocale();
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper className={classes.paper} elevation={1}>
      <VirtualizedList
        data={passives}
        loading={loading}
        customItemHeight={theme.spacing(15)}
        noEntriesLabel={
          noAccountsCreated
            ? locale('movements:atLeastOneAccount')
            : locale('movements:noneCreated', { value: locale('elements:plural:passive') })
        }
      >
        {({ data, index, style }) => (
          <Box style={style} key={index}>
            <PassiveListItem passive={data[index]} />
          </Box>
        )}
      </VirtualizedList>
    </Paper>
  );
};

export default PassivesList;
