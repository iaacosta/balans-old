import React from 'react';
import { Add as AddIcon } from '@material-ui/icons';
import { Hidden, Box, makeStyles } from '@material-ui/core';
import DialogButton from '../ui/dialogs/DialogButton';
import CreateTransferDialog from './CreateTransferDialog';
import { useMyDebitAccounts } from '../../hooks/graphql';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const Transfers: React.FC = () => {
  const classes = useStyles();
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const notEnoughAccounts = accounts.length < 2;

  const Button = (
    <DialogButton
      disabled={notEnoughAccounts || accountsLoading}
      buttonLabel="Add new transfer"
      data-testid="createTransferButton"
      startIcon={<AddIcon />}
    >
      <CreateTransferDialog />
    </DialogButton>
  );

  return (
    <>
      <Hidden smDown>
        <div>Table</div>
        <Box className={classes.buttonWrapper}>{Button}</Box>
      </Hidden>
      <Hidden mdUp>
        <div>List</div>
        <Box className={classes.buttonWrapper}>{Button}</Box>
      </Hidden>
    </>
  );
};

export default Transfers;
