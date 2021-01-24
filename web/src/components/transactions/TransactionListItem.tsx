import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import React from 'react';
import { MyTransactionsQuery } from '../../@types/graphql';
import { useDeleteTransaction } from '../../hooks/graphql';
import { longDateFormatter } from '../../utils/date';
import AmountTypography from '../ui/dataDisplay/AmountTypography';
import DialogIconButton from '../ui/dialogs/DialogIconButton';
import CategoryIcon from '../ui/misc/CategoryIcon';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import UpdateTransactionDialog from './UpdateTransactionDialog';

interface Props {
  transaction: MyTransactionsQuery['transactions'][number];
}

const useStyles = makeStyles((theme) => ({
  container: { listStyle: 'none' },
  paper: { margin: theme.spacing(1), padding: theme.spacing(2), display: 'flex' },
  info: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(1),
    overflow: 'hidden',
    '& > *:not(:last-child)': { marginBottom: theme.spacing(0.5) },
  },
  secondary: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  category: { display: 'flex', alignItems: 'center' },
  actions: {
    marginLeft: 'auto',
    alignSelf: 'center',
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const TransactionListItem: React.FC<Props> = ({ transaction }) => {
  const classes = useStyles();
  const [deleteTransaction, { loading: deleteLoading }] = useDeleteTransaction();
  const { id, amount, memo, account, category, issuedAt } = transaction;

  return (
    <Paper className={classes.paper} elevation={1}>
      <Box className={classes.info}>
        <AmountTypography>{amount}</AmountTypography>
        <Typography variant="body2">{memo}</Typography>
        <Typography className={classes.secondary} variant="caption" color="textSecondary">
          {account.name} | {longDateFormatter(issuedAt)}
        </Typography>
        <Box className={classes.category}>
          <CategoryIcon size="small" color={category?.color} />
          <Typography variant="caption">{category?.name || 'None'}</Typography>
        </Box>
      </Box>
      <Box className={classes.actions}>
        <DialogIconButton
          data-testid={`updateTransaction${id}`}
          icon={<EditIcon />}
          contained
          color="info"
        >
          <UpdateTransactionDialog transaction={transaction} />
        </DialogIconButton>
        <EnhancedIconButton
          onClick={() => deleteTransaction(id)}
          contained
          disabled={deleteLoading}
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </EnhancedIconButton>
      </Box>
    </Paper>
  );
};

export default TransactionListItem;
