import React from 'react';
import { Card, CardContent, Typography, CardActions, Box, makeStyles } from '@material-ui/core';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';

import { Currency, MyAccountsQuery } from '../../@types/graphql';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import { useBreakpoint } from '../../hooks/utils/useBreakpoint';
import { useDeleteDebitAccount } from '../../hooks/graphql';
import { useLocale } from '../../hooks/utils/useLocale';
import { localeKeyFromAccountType } from '../../utils/accounts';
import AmountTypography from '../ui/dataDisplay/AmountTypography';
import accountingConstants from '../../constants/accountingConstants';

interface Props {
  debitAccount: MyAccountsQuery['accounts'][number];
  showAmountsInClp: boolean;
  clpUsdExchangeRate: number;
}

const useStyles = makeStyles((theme) => ({
  balance: { marginTop: theme.spacing(2) },
  currencySymbol: { marginRight: theme.spacing(1) },
  type: { margin: theme.spacing(0, 0, 1, 1), lineHeight: theme.typography.body2.lineHeight },
  actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  buttons: { display: 'flex', '& > *:not(:last-child)': { marginRight: theme.spacing(1) } },
  subBalance: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subBalanceAnnotation: { fontSize: 10, opacity: 0.6 },
  subBalanceOperand: { opacity: 0.5 },
  subBalanceWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: -theme.spacing(2),
    opacity: 0.8,
    '& > *:not(:last-child)': { marginRight: theme.spacing(2) },
  },
}));

const DebitAccountCard: React.FC<Props> = ({
  debitAccount: { id, name, bank, balance, currency, unliquidatedBalance, type },
  showAmountsInClp,
  clpUsdExchangeRate,
}) => {
  const classes = useStyles();
  const isMobile = useBreakpoint({ layout: 'xs' });
  const { locale } = useLocale();
  const [deleteDebitAccount, { loading: deleteLoading }] = useDeleteDebitAccount();

  const iconFontSize = isMobile ? 'small' : 'default';

  const displayedCurrency = showAmountsInClp && currency === Currency.Usd ? Currency.Clp : currency;

  const applyExchangeRate = (value: number, valueCurrency: Currency) =>
    showAmountsInClp && valueCurrency === Currency.Usd
      ? (value * clpUsdExchangeRate) / 10 ** accountingConstants[Currency.Usd].decimalPlaces
      : value;

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {name} / {bank}
          </Typography>
          <AmountTypography
            currencySymbolProps={{
              variant: 'h5',
              color: 'textSecondary',
              className: classes.currencySymbol,
            }}
            currency={displayedCurrency}
            className={classes.balance}
            variant="h2"
            noColor
          >
            {applyExchangeRate(balance + unliquidatedBalance, currency)}
          </AmountTypography>
          <Box className={classes.subBalanceWrapper}>
            <Box className={classes.subBalance}>
              <AmountTypography hideCurrencySymbol currency={displayedCurrency} variant="subtitle1">
                {applyExchangeRate(balance, currency)}
              </AmountTypography>
              <Typography className={classes.subBalanceAnnotation} variant="body2">
                {locale('others:liquidated')}
              </Typography>
            </Box>
            <Typography className={classes.subBalanceOperand} variant="subtitle1">
              +
            </Typography>
            <Box className={classes.subBalance}>
              <AmountTypography hideCurrencySymbol currency={displayedCurrency} variant="subtitle1">
                {applyExchangeRate(unliquidatedBalance, currency)}
              </AmountTypography>
              <Typography className={classes.subBalanceAnnotation} variant="body2">
                {locale('others:unliquidated')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions className={classes.actions}>
          <Typography className={classes.type} variant="overline" color="textSecondary">
            {locale(localeKeyFromAccountType(type))} ({currency})
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
