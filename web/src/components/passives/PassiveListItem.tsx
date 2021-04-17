import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon, Payment as PaymentIcon } from '@material-ui/icons';
import React from 'react';
import { MyPassivesQuery } from '../../@types/graphql';
import { useDeletePassive } from '../../hooks/graphql';
import { longDateFormatter } from '../../utils/date';
import AmountTypography from '../ui/dataDisplay/AmountTypography';
import DialogIconButton from '../ui/dialogs/DialogIconButton';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import LiquidatePassiveDialog from './LiquidatePassiveDialog';

interface Props {
  passive: MyPassivesQuery['passives'][number];
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

const PassiveListItem: React.FC<Props> = ({ passive }) => {
  const classes = useStyles();
  const [deletePassive, { loading: deleteLoading }] = useDeletePassive();
  const { id, amount, memo, account, liquidatedAccount, liquidated, issuedAt } = passive;

  return (
    <Paper className={classes.paper} elevation={1}>
      <Box className={classes.info}>
        <AmountTypography>{amount}</AmountTypography>
        <Typography variant="body2">{memo}</Typography>
        <Typography className={classes.secondary} variant="caption" color="textSecondary">
          {liquidated ? liquidatedAccount?.name : account.name} | {longDateFormatter(issuedAt)}
        </Typography>
      </Box>
      <Box className={classes.actions}>
        {!liquidated && (
          <DialogIconButton
            contained
            data-testid={`liquidatePassive${id}`}
            color="warning"
            icon={<PaymentIcon />}
          >
            <LiquidatePassiveDialog passive={passive} />
          </DialogIconButton>
        )}
        <EnhancedIconButton data-testid={`updatePassive${id}`} disabled contained color="info">
          <EditIcon />
        </EnhancedIconButton>
        <EnhancedIconButton
          onClick={() => deletePassive(id)}
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

export default PassiveListItem;
