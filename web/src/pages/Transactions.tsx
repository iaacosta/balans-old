import React from 'react';
import { Typography, makeStyles, Paper, Box } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import ViewportContainer from '../components/ui/ViewportContainer';
import DialogButton from '../components/ui/DialogButton';
import CreateTransactionDialog from '../components/transactions/CreateTransactionDialog';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
  transactions: { flex: 1, padding: theme.spacing(4), overflow: 'auto' },
  buttons: { marginTop: theme.spacing(2), display: 'flex', justifyContent: 'flex-end' },
}));

const Transactions: React.FC = () => {
  const classes = useStyles();

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        My transactions
      </Typography>
      <Paper className={classes.transactions} elevation={1}>
        Transactions
      </Paper>
      <Box className={classes.buttons}>
        <DialogButton
          buttonLabel="Add new transaction"
          DialogComponent={CreateTransactionDialog}
          startIcon={<AddIcon />}
        />
      </Box>
    </ViewportContainer>
  );
};

export default Transactions;
