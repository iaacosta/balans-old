import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
  CardActions,
  Box,
} from '@material-ui/core';
import { capitalize } from 'lodash';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { formatMoney } from 'accounting';

import { myAccountsQuery } from '../../graphql/account';
import { MyAccountsQueryVariables, MyAccountsQuery } from '../../@types/graphql';
import ContainerLoader from '../ui/ContainerLoader';
import { useRedirectedQuery } from '../../hooks/useRedirectedQuery';
import EnhancedIconButton from '../ui/EnhancedIconButton';

const useStyles = makeStyles((theme) => ({
  balance: { marginTop: theme.spacing(2) },
  type: { margin: theme.spacing(0, 0, 1, 1), lineHeight: theme.typography.body2.lineHeight },
  actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  buttons: { display: 'flex', '& > *:not(:last-child)': { marginRight: theme.spacing(1) } },
}));

const DebitAccountsGrid: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useRedirectedQuery<MyAccountsQuery, MyAccountsQueryVariables>(
    myAccountsQuery,
  );

  if (loading || !data) return <ContainerLoader />;

  const { accounts } = data;
  return accounts.length > 0 ? (
    <Grid container data-testid="account" spacing={3}>
      {accounts.map(({ id, bank, name, balance, type }) => (
        <Grid key={id} data-testid={`account${id}`} item xs={6}>
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
                {capitalize(type)}
              </Typography>
              <Box className={classes.buttons}>
                <EnhancedIconButton contained disabled color="success">
                  <VisibilityIcon />
                </EnhancedIconButton>
                <EnhancedIconButton contained disabled color="info">
                  <EditIcon />
                </EnhancedIconButton>
                <EnhancedIconButton contained disabled color="error">
                  <DeleteIcon />
                </EnhancedIconButton>
              </Box>
            </CardActions>
          </Card>
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
