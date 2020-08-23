import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { myAccountsQuery } from '../../graphql/account';
import { MyAccountsQueryVariables, MyAccountsQuery } from '../../@types/graphql';
import ContainerLoader from '../ui/ContainerLoader';
import { useRedirectedQuery } from '../../hooks/graphql/useRedirectedQuery';
import DebitAccountCard from './DebitAccountCard';

const DebitAccountsGrid: React.FC = () => {
  const { data, loading } = useRedirectedQuery<MyAccountsQuery, MyAccountsQueryVariables>(
    myAccountsQuery,
  );

  if (loading || !data) return <ContainerLoader />;

  const { accounts } = data;
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
