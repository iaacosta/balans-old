import React, { useMemo, useState } from 'react';
import { Typography, makeStyles, Paper, Box, FormControlLabel, Switch } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import { useTabs } from '../hooks/utils/useTabs';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import CustomTabs from '../components/ui/navigation/CustomTabs';
import DebitAccountsGrid from '../components/accounts/DebitAccountsGrid';
import DialogButton from '../components/ui/dialogs/DialogButton';
import CreateDebitAccountDialog from '../components/accounts/CreateDebitAccountDialog';
import { useLocale } from '../hooks/utils/useLocale';

const useStyles = makeStyles((theme) => ({
  main: { maxWidth: theme.spacing(130) },
  title: { marginBottom: theme.spacing(2) },
  accounts: {
    flex: 1,
    padding: theme.spacing(4),
    overflow: 'auto',
    [theme.breakpoints.down('xs')]: { padding: theme.spacing(2) },
  },
  controls: { padding: theme.spacing(1, 4) },
  buttonWrapper: { display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing(2) },
}));

const Accounts: React.FC = () => {
  const classes = useStyles();
  const { locale } = useLocale();
  const [showAmountsInClp, setShowAmountsInClp] = useState(false);

  const tabs = useMemo(
    () => [
      { key: 'debit' as const, label: locale('accounts:tabs:debit') },
      { key: 'credit' as const, label: locale('accounts:tabs:credit'), disabled: true },
    ],
    [locale],
  );

  const { selected, change } = useTabs({
    tabs: tabs.map(({ key }) => key),
    initialTab: 'debit',
  });

  return (
    <ViewportContainer className={classes.main}>
      <Typography className={classes.title} variant="h5">
        {locale('accounts:title')}
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      <Paper className={classes.controls} square>
        <FormControlLabel
          control={
            <Switch
              checked={showAmountsInClp}
              onChange={() => setShowAmountsInClp(!showAmountsInClp)}
            />
          }
          label={locale('accounts:actions:amountsInCLP')}
        />
      </Paper>
      <Paper className={classes.accounts} square elevation={1}>
        {selected === 'debit' && <DebitAccountsGrid />}
      </Paper>
      <Box className={classes.buttonWrapper}>
        {selected === 'debit' && (
          <DialogButton
            buttonLabel={locale('accounts:create:debit')}
            data-testid="createAccountButton"
            startIcon={<AddIcon />}
          >
            <CreateDebitAccountDialog />
          </DialogButton>
        )}
      </Box>
    </ViewportContainer>
  );
};

export default Accounts;
