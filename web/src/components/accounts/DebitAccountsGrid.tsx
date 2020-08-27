import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import ContainerLoader from '../ui/misc/ContainerLoader';
import DebitAccountCard from './DebitAccountCard';
import { useMyDebitAccounts } from '../../hooks/graphql';

const DebitAccountsGrid: React.FC = () => {
  const { accounts, loading } = useMyDebitAccounts();

  if (loading) return <ContainerLoader />;

  return accounts.length > 0 ? (
    <Grid container data-testid="account" spacing={3}>
      {accounts.map((account) => (
        <Grid key={account.id} data-testid={`account${account.id}`} item xs={12} sm={6}>
          <DebitAccountCard debitAccount={account} />
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography variant="caption" color="textSecondary">
      You have no debit accounts yet. Go ahead and create one!
    </Typography>
  );
};

export default DebitAccountsGrid;
