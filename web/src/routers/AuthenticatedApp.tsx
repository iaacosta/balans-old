import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';

import routing from '../constants/routing';
import CustomDrawer from '../components/ui/CustomDrawer';

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
  return (
    <>
      <CustomDrawer />
      <Box ml={32}>
        <Switch>
          <Route path={routing.authenticated.dashboard.path} component={Placeholder} exact />
          <Route path={routing.authenticated.movements.path} component={Placeholder} exact />
          <Route path={routing.authenticated.otherMovements.path} component={Placeholder} exact />
          <Route path={routing.authenticated.places.path} component={Placeholder} exact />
          <Route path={routing.authenticated.people.path} component={Placeholder} exact />
          <Route>
            <Redirect to={routing.authenticated.dashboard.path} />
          </Route>
        </Switch>
      </Box>
    </>
  );
};

export default AuthenticatedApp;
