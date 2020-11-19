/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {
  ListItem,
  ListItemText,
  makeStyles,
  Divider,
  ListItemSecondaryAction,
  Box,
  Paper,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { MyTransactionsQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import { useDeleteTransaction } from '../../hooks/graphql';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import DialogIconButton from '../ui/dialogs/DialogIconButton';
import UpdateTransactionDialog from './UpdateTransactionDialog';
import { useLocale } from '../../hooks/utils/useLocale';
import AmountTypography from '../ui/dataDisplay/AmountTypography';

type Props = {
  transactions: MyTransactionsQuery['transactions'];
  loading: boolean;
  noAccountsCreated: boolean;
};

const useStyles = makeStyles((theme) => ({
  paper: { flex: 1 },
  container: { listStyle: 'none' },
  secondaryActions: {
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const TransactionsList: React.FC<Props> = ({ transactions, loading, noAccountsCreated }) => {
  const { locale } = useLocale();
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={1}>
      <VirtualizedList
        data={transactions}
        loading={loading}
        noEntriesLabel={
          noAccountsCreated
            ? locale('movements:atLeastOneAccount')
            : locale('movements:noneCreated', { value: locale('elements:plural:transaction') })
        }
      >
        {({ data, index, style }) => {
          const [deleteTransaction, { loading: deleteLoading }] = useDeleteTransaction();
          const { id, amount, account } = data[index];
          return (
            <Box style={style} key={index}>
              <ListItem classes={{ container: classes.container }} component="div">
                <ListItemText
                  primary={<AmountTypography>{amount}</AmountTypography>}
                  secondary={`${account.name} (${account.bank})`}
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                  <DialogIconButton
                    data-testid={`updateTransaction${id}`}
                    icon={<EditIcon />}
                    contained
                    color="info"
                  >
                    <UpdateTransactionDialog transaction={data[index]} />
                  </DialogIconButton>
                  <EnhancedIconButton
                    onClick={() => deleteTransaction(id)}
                    contained
                    disabled={deleteLoading}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </EnhancedIconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="middle" />
            </Box>
          );
        }}
      </VirtualizedList>
    </Paper>
  );
};

export default TransactionsList;
