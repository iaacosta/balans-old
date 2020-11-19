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
import { Delete as DeleteIcon, Edit as EditIcon, Payment as PaymentIcon } from '@material-ui/icons';
import { formatMoney } from 'accounting';
import clsx from 'clsx';
import { MyPassivesQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import DialogIconButton from '../ui/dialogs/DialogIconButton';
import { useLocale } from '../../hooks/utils/useLocale';
import LiquidatePassiveDialog from './LiquidatePassiveDialog';

type Props = {
  passives: MyPassivesQuery['passives'];
  loading: boolean;
  noAccountsCreated: boolean;
};

const useStyles = makeStyles((theme) => ({
  paper: { flex: 1 },
  container: { listStyle: 'none' },
  expense: { color: theme.palette.error.main },
  income: { color: theme.palette.success.main },
  secondaryActions: {
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const PassivesList: React.FC<Props> = ({ passives, loading, noAccountsCreated }) => {
  const { locale } = useLocale();
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={1}>
      <VirtualizedList
        data={passives}
        loading={loading}
        noEntriesLabel={
          noAccountsCreated
            ? locale('movements:atLeastOneAccount')
            : locale('movements:noneCreated', { value: locale('elements:plural:passive') })
        }
      >
        {({ data, index, style }) => {
          const { id, amount, account } = data[index];
          const cls = clsx(amount > 0 && classes.income, amount < 0 && classes.expense);
          return (
            <Box style={style} key={index}>
              <ListItem classes={{ container: classes.container }} component="div">
                <ListItemText
                  className={cls}
                  primary={formatMoney(amount)}
                  secondary={`${account.name} (${account.bank})`}
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                  <DialogIconButton
                    contained
                    disabled
                    data-testid={`updatePassive${id}`}
                    color="info"
                    icon={<PaymentIcon />}
                  >
                    <LiquidatePassiveDialog passive={data[index]} />
                  </DialogIconButton>
                  <EnhancedIconButton
                    contained
                    disabled
                    data-testid={`updatePassive${id}`}
                    color="info"
                  >
                    <EditIcon />
                  </EnhancedIconButton>
                  <EnhancedIconButton
                    contained
                    disabled
                    data-testid={`deletePassive${id}`}
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

export default PassivesList;
