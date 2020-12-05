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
import { MyPassivesQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import VirtualizedList from '../ui/dataDisplay/VirtualizedList';
import DialogIconButton from '../ui/dialogs/DialogIconButton';
import { useLocale } from '../../hooks/utils/useLocale';
import LiquidatePassiveDialog from './LiquidatePassiveDialog';
import AmountTypography from '../ui/dataDisplay/AmountTypography';
import { useDeletePassive } from '../../hooks/graphql';

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
  const [deletePassive, { loading: deleteLoading }] = useDeletePassive();
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
          const { id, amount, account, liquidated } = data[index];
          return (
            <Box style={style} key={index}>
              <ListItem classes={{ container: classes.container }} component="div">
                <ListItemText
                  primary={<AmountTypography>{amount}</AmountTypography>}
                  secondary={`${account.name} (${account.bank})`}
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                  {!liquidated && (
                    <DialogIconButton
                      contained
                      data-testid={`liquidatePassive${id}`}
                      color="warning"
                      icon={<PaymentIcon />}
                    >
                      <LiquidatePassiveDialog passive={data[index]} />
                    </DialogIconButton>
                  )}
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
                    disabled={deleteLoading}
                    data-testid={`deletePassive${id}`}
                    color="error"
                    onClick={() => deletePassive(id)}
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
