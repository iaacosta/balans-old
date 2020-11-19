import React from 'react';
import { Add as AddIcon } from '@material-ui/icons';
import { Box, Hidden, makeStyles } from '@material-ui/core';
import { useMyDebitAccounts, useMyPassives } from '../../hooks/graphql';
import DialogButton from '../ui/dialogs/DialogButton';
import CreatePassiveDialog from './CreatePassiveDialog';
import { useLocale } from '../../hooks/utils/useLocale';
import PassivesTable from './PassivesTable';
import PassivesList from './PassivesList';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const Passives: React.FC = () => {
  const classes = useStyles();
  const { locale } = useLocale();
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const { passives, loading: passivesLoading } = useMyPassives();

  const noAccounts = accounts.length === 0;
  const loading = accountsLoading || passivesLoading;

  const Button = (
    <DialogButton
      disabled={accountsLoading || noAccounts}
      buttonLabel={locale('movements:create:passive')}
      data-testid="createPassiveButton"
      startIcon={<AddIcon />}
    >
      <CreatePassiveDialog />
    </DialogButton>
  );

  return (
    <>
      <Hidden smDown>
        <PassivesTable passives={passives} loading={loading} noAccountsCreated={noAccounts}>
          {Button}
        </PassivesTable>
      </Hidden>
      <Hidden mdUp>
        <PassivesList passives={passives} loading={loading} noAccountsCreated={noAccounts} />
        <Box className={classes.buttonWrapper}>{Button}</Box>
      </Hidden>
    </>
  );
};

export default Passives;
