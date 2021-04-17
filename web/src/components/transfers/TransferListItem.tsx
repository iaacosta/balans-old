import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingFlat as TransferIcon,
} from '@material-ui/icons';
import React from 'react';
import { MyTransfersQuery } from '../../@types/graphql';
import { useDeleteTransfer } from '../../hooks/graphql';
import { longDateFormatter } from '../../utils/date';
import AmountTypography from '../ui/dataDisplay/AmountTypography';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';

interface Props {
  transfer: MyTransfersQuery['transfers'][number];
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
  accounts: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    '& > *:not(:last-child)': { marginRight: theme.spacing(0.5) },
  },
  icon: { color: theme.palette.action.disabled },
  category: { display: 'flex', alignItems: 'center' },
  actions: {
    marginLeft: 'auto',
    alignSelf: 'center',
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const TransferListItem: React.FC<Props> = ({ transfer }) => {
  const classes = useStyles();
  const [deleteTransfer, { loading: deleteLoading }] = useDeleteTransfer();
  const { from, to } = transfer;
  const { amount, memo, issuedAt } = to;

  return (
    <Paper className={classes.paper} elevation={1}>
      <Box className={classes.info}>
        <AmountTypography
          formattingConditions={{
            neutral: () => true,
            expense: () => false,
            income: () => false,
          }}
        >
          {amount}
        </AmountTypography>
        <Typography variant="body2">{memo}</Typography>
        <Box className={classes.accounts}>
          <Typography variant="caption">{from.account.name}</Typography>
          <TransferIcon fontSize="small" className={classes.icon} />
          <Typography variant="caption">{to.account.name}</Typography>
        </Box>
        <Typography variant="caption" color="textSecondary">
          {longDateFormatter(issuedAt)}
        </Typography>
      </Box>
      <Box className={classes.actions}>
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
      </Box>
    </Paper>
  );
};

export default TransferListItem;
