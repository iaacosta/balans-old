import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Box, Typography, makeStyles } from '@material-ui/core';

import routing from '../constants/routing';
import ResponsiveDrawer from '../components/ui/ResponsiveDrawer';
import { useCan } from '../hooks/auth/useRbac';
import { actions } from '../utils/rbac';
import ContainerLoader from '../components/ui/ContainerLoader';
import Users from '../pages/Users';
import Accounts from '../pages/Accounts';
import ViewportContainer from '../components/ui/ViewportContainer';
import Transactions from '../pages/Transactions';

const Placeholder: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <ViewportContainer>
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h2">Oops!</Typography>
        <Typography variant="h5">
          <span style={{ color: '#999' }}>{pathname}</span> site under construction
        </Typography>
      </Box>
    </ViewportContainer>
  );
};

const useStyles = makeStyles((theme) => ({
  main: {
    marginLeft: theme.spacing(32),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      '&::before': {
        ...theme.mixins.toolbar,
        content: '""',
        display: 'block',
      },
    },
  },
  content: {
    margin: theme.spacing(6),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2),
    },
  },
}));

const AuthenticatedApp: React.FC = () => {
  const classes = useStyles();
  const { canPerform, loading, error } = useCan();

  if (loading || error) {
    return (
      <ViewportContainer>
        <ContainerLoader color="secondary" />
      </ViewportContainer>
    );
  }

  return (
    <>
      <ResponsiveDrawer />
      <Box className={classes.main}>
        <Box className={classes.content}>
          <Switch>
            {canPerform(actions.routes.dashboard) && (
              <Route path={routing.authenticated.dashboard} component={Placeholder} exact />
            )}
            {canPerform(actions.routes.transactions) && (
              <Route path={routing.authenticated.accounts} component={Accounts} exact />
            )}
            {canPerform(actions.routes.movements) && (
              <Route path={routing.authenticated.transactions} component={Transactions} exact />
            )}
            {canPerform(actions.routes.otherMovements) && (
              <Route path={routing.authenticated.otherMovements} component={Placeholder} exact />
            )}
            {canPerform(actions.routes.places) && (
              <Route path={routing.authenticated.places} component={Placeholder} exact />
            )}
            {canPerform(actions.routes.people) && (
              <Route path={routing.authenticated.people} component={Placeholder} exact />
            )}
            {canPerform(actions.routes.users) && (
              <Route path={routing.authenticated.users} component={Users} exact />
            )}
            <Route>
              <Redirect to={routing.authenticated.dashboard} />
            </Route>
          </Switch>
        </Box>
      </Box>
    </>
  );
};

export default AuthenticatedApp;
