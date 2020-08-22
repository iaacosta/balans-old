import React from 'react';
import { Typography, makeStyles, Paper, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { useTabs } from '../hooks/useTabs';
import ViewportContainer from '../components/ui/ViewportContainer';
import CustomTabs from '../components/ui/CustomTabs';
import DebitAccountsGrid from '../components/accounts/DebitAccountsGrid';
import DialogButton from '../components/ui/DialogButton';
import CreateDebitAccountDialog from '../components/accounts/CreateDebitAccountDialog';

const useStyles = makeStyles((theme) => ({
  main: { maxWidth: theme.spacing(130) },
  title: { marginBottom: theme.spacing(2) },
  accounts: {
    flex: 1,
    padding: theme.spacing(4),
    overflow: 'auto',
    [theme.breakpoints.down('xs')]: { padding: theme.spacing(2) },
  },
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
    <ViewportContainer className={classes.main}>
      <Typography className={classes.title} variant="h5">
        My accounts
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      <Paper className={classes.accounts} square elevation={1}>
        {selected === 'debit' && <DebitAccountsGrid />}
      </Paper>
      <Box className={classes.buttonWrapper}>
        {selected === 'debit' && (
          <DialogButton
            buttonLabel="Create new debit account"
            DialogComponent={CreateDebitAccountDialog}
            data-testid="createAccountButton"
            startIcon={<AddIcon />}
          />
        )}
      </Box>
    </ViewportContainer>
  );
};

export default Accounts;
