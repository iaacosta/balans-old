import React from 'react';
import { Add as AddIcon } from '@material-ui/icons';
import { Hidden, Box, makeStyles } from '@material-ui/core';
import DialogButton from '../ui/dialogs/DialogButton';
import CreateTransferDialog from './CreateTransferDialog';
import { useMyDebitAccounts, useMyTransfers } from '../../hooks/graphql';
import TransfersTable from './TransfersTable';
import TransfersList from './TransfersList';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const Transfers: React.FC = () => {
  const classes = useStyles();
  const { transfers, loading: transfersLoading } = useMyTransfers();
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
        <TransfersTable
          loading={transfersLoading || accountsLoading}
          transfers={transfers}
          notEnoughAccounts={notEnoughAccounts}
        >
          {Button}
        </TransfersTable>
      </Hidden>
      <Hidden mdUp>
        <TransfersList
          loading={transfersLoading || accountsLoading}
          transfers={transfers}
          notEnoughAccounts={notEnoughAccounts}
        />
        <Box className={classes.buttonWrapper}>{Button}</Box>
      </Hidden>
    </>
  );
};

export default Transfers;
