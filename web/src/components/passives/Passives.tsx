import React from 'react';
import { Add as AddIcon } from '@material-ui/icons';
import { Box, makeStyles } from '@material-ui/core';
import { useMyDebitAccounts } from '../../hooks/graphql';
import DialogButton from '../ui/dialogs/DialogButton';
import CreatePassiveDialog from './CreatePassiveDialog';
import { useLocale } from '../../hooks/utils/useLocale';

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

  const noAccounts = accounts.length === 0;

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

  return <Box className={classes.buttonWrapper}>{Button}</Box>;
};

export default Passives;
