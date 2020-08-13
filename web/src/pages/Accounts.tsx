import React from 'react';
import { Typography, makeStyles, Paper, Box } from '@material-ui/core';
import { useTabs } from '../hooks/useTabs';
import ViewportContainer from '../components/ui/ViewportContainer';
import CustomTabs from '../components/ui/CustomTabs';
import CreateDebitAccountButton from '../components/accounts/CreateDebitAccountButton';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
  accounts: { flex: 1, padding: theme.spacing(4) },
  buttonWrapper: { display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing(2) },
}));

const tabs = [
  { key: 'debit' as const, label: 'Debit accounts' },
  { key: 'credit' as const, label: 'Credit accounts' },
];

const Accounts: React.FC = () => {
  const classes = useStyles();
  const { selected, change } = useTabs({
    tabs: tabs.map(({ key }) => key),
    initialTab: 'debit',
  });

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        My accounts
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      <Paper className={classes.accounts} elevation={1}>
        Accounts
      </Paper>
      <Box className={classes.buttonWrapper}>
        {selected === 'debit' && <CreateDebitAccountButton />}
      </Box>
    </ViewportContainer>
  );
};

export default Accounts;
