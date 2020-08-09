import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';

import routing from '../constants/routing';
import CustomDrawer from '../components/ui/CustomDrawer';
import { useCan } from '../hooks/useRbac';
import { actions } from '../utils/rbac';
import ContainerLoader from '../components/ui/ContainerLoader';
import Users from '../pages/Users';

const Placeholder: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h2">Oops!</Typography>
      <Typography variant="h5">
        <span style={{ color: '#999' }}>{pathname}</span> site under construction
      </Typography>
    </Box>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { canPerform, loading, error } = useCan();

  if (loading || error) {
    return (
      <Box height="100vh">
        <ContainerLoader color="secondary" />
      </Box>
    );
  }

  return (
    <>
      <CustomDrawer />
      <Box ml={32}>
        <Box m={6}>
          <Switch>
            {canPerform(actions.routes.dashboard) && (
              <Route path={routing.authenticated.dashboard} component={Placeholder} exact />
            )}
            {canPerform(actions.routes.movements) && (
              <Route path={routing.authenticated.movements} component={Placeholder} exact />
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
