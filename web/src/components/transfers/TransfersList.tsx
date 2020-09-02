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
  Typography,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingFlat as TransferIcon,
} from '@material-ui/icons';
import { formatMoney } from 'accounting';
import { MyTransfersQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';

type Props = {
  transfers: MyTransfersQuery['transfers'];
  loading: boolean;
  notEnoughAccounts: boolean;
};

const useStyles = makeStyles((theme) => ({
  paper: { flex: 1 },
  container: { listStyle: 'none' },
  amount: { color: theme.palette.info.main },
  icon: { color: theme.palette.action.disabled },
  secondaryActions: {
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
  transfer: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const TransfersList: React.FC<Props> = ({ transfers, loading, notEnoughAccounts }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} square elevation={1}>
      <VirtualizedList
        data={transfers}
        loading={loading}
        noEntriesLabel={
          notEnoughAccounts
            ? 'You need at least two accounts to make transfers'
            : 'No transfers created yet'
        }
      >
        {({ data, index, style }) => {
          const { from, to } = data[index];
          const { amount } = to;
          return (
            <Box style={style} key={index}>
              <ListItem classes={{ container: classes.container }} component="div">
                <ListItemText
                  className={classes.amount}
                  primary={formatMoney(amount)}
                  secondaryTypographyProps={{ component: 'div', className: classes.transfer }}
                  secondary={
                    <>
                      <Typography variant="body2">{from.account.name}</Typography>
                      <TransferIcon className={classes.icon} />
                      <Typography variant="body2">{to.account.name}</Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                  <EnhancedIconButton
                    data-testid={`updateTransfer${from.id}`}
                    disabled
                    contained
                    color="info"
                  >
                    <EditIcon />
                  </EnhancedIconButton>
                  <EnhancedIconButton
                    data-testid={`deleteTransfer${from.id}`}
                    contained
                    disabled
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

export default TransfersList;
