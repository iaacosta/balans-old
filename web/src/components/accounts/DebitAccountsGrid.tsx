import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import ContainerLoader from '../ui/misc/ContainerLoader';
import DebitAccountCard from './DebitAccountCard';
import { useMyDebitAccounts, useClpUsdExchangeRate } from '../../hooks/graphql';
import { useLocale } from '../../hooks/utils/useLocale';

type Props = {
  showAmountsInClp: boolean;
};

const DebitAccountsGrid: React.FC<Props> = ({ showAmountsInClp }) => {
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const { clpUsdExchangeRate, loading: clpUsdExchangeRateLoading } = useClpUsdExchangeRate();
  const { locale } = useLocale();

  if (accountsLoading || clpUsdExchangeRateLoading) return <ContainerLoader />;

  return accounts.length > 0 ? (
    <Grid container data-testid="account" spacing={3}>
      {accounts.map((account) => (
        <Grid key={account.id} data-testid={`account${account.id}`} item xs={12} sm={6}>
          <DebitAccountCard
            clpUsdExchangeRate={clpUsdExchangeRate}
            showAmountsInClp={showAmountsInClp}
            debitAccount={account}
          />
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography variant="caption" color="textSecondary">
      {locale('accounts:noDebitAccounts')}
    </Typography>
  );
};

export default DebitAccountsGrid;
