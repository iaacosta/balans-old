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
import { MyTransfersQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import { useDeleteTransfer } from '../../hooks/graphql';
import { useLocale } from '../../hooks/utils/useLocale';
import AmountTypography from '../ui/dataDisplay/AmountTypography';

type Props = {
  transfers: MyTransfersQuery['transfers'];
  loading: boolean;
  notEnoughAccounts: boolean;
};

const useStyles = makeStyles((theme) => ({
  paper: { flex: 1 },
  container: { listStyle: 'none' },
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
  const { locale } = useLocale();

  return (
    <Paper className={classes.paper} square elevation={1}>
      <VirtualizedList
        data={transfers}
        loading={loading}
        noEntriesLabel={
          notEnoughAccounts
            ? locale('movements:atLeastTwoAccounts')
            : locale('movements:noneCreated', { value: locale('elements:plural:transfer') })
        }
      >
        {({ data, index, style }) => {
          const { from, to } = data[index];
          const { amount } = to;
          const [deleteTransfer, { loading: deleteLoading }] = useDeleteTransfer();
          return (
            <Box style={style} key={index}>
              <ListItem classes={{ container: classes.container }} component="div">
                <ListItemText
                  primary={
                    <AmountTypography
                      formattingConditions={{
                        neutral: () => true,
                        expense: () => false,
                        income: () => false,
                      }}
                    >
                      {amount}
                    </AmountTypography>
                  }
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
                    disabled={deleteLoading}
                    onClick={() => deleteTransfer(from.operationId)}
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
