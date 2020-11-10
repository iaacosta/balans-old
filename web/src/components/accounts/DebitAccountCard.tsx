import React from 'react';
import { Card, CardContent, Typography, CardActions, Box, makeStyles } from '@material-ui/core';
import { formatMoney } from 'accounting';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';

import { MyAccountsQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import { useBreakpoint } from '../../hooks/utils/useBreakpoint';
import { useDeleteDebitAccount } from '../../hooks/graphql';
import { useLocale } from '../../hooks/utils/useLocale';
import { localeKeyFromAccountType } from '../../utils/accounts';

interface Props {
  debitAccount: MyAccountsQuery['accounts'][number];
}

const useStyles = makeStyles((theme) => ({
  balance: { marginTop: theme.spacing(2) },
  type: { margin: theme.spacing(0, 0, 1, 1), lineHeight: theme.typography.body2.lineHeight },
  actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  buttons: { display: 'flex', '& > *:not(:last-child)': { marginRight: theme.spacing(1) } },
}));

const DebitAccountCard: React.FC<Props> = ({ debitAccount: { id, name, bank, balance, type } }) => {
  const classes = useStyles();
  const isMobile = useBreakpoint({ layout: 'xs' });
  const { locale } = useLocale();
  const [deleteDebitAccount, { loading: deleteLoading }] = useDeleteDebitAccount();

  const iconFontSize = isMobile ? 'small' : 'default';
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {name} / {bank}
          </Typography>
          <Typography className={classes.balance} variant="h2">
            {formatMoney(balance)}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <Typography className={classes.type} variant="overline" color="textSecondary">
            {locale(localeKeyFromAccountType(type))}
          </Typography>
          <Box className={classes.buttons}>
            <EnhancedIconButton contained disabled color="success">
              <VisibilityIcon fontSize={iconFontSize} />
            </EnhancedIconButton>
            <EnhancedIconButton contained disabled color="info">
              <EditIcon fontSize={iconFontSize} />
            </EnhancedIconButton>
            <EnhancedIconButton
              contained
              data-testid={`deleteAccount${id}`}
              disabled={deleteLoading}
              onClick={() => deleteDebitAccount(id)}
              color="error"
            >
              <DeleteIcon fontSize={iconFontSize} />
            </EnhancedIconButton>
          </Box>
        </CardActions>
      </Card>
    </>
  );
};

export default DebitAccountCard;
