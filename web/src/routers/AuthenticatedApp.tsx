import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Box } from '@material-ui/core';

import routing from '../constants/routing';
import Dashboard from '../pages/dashboard/Dashboard';
import CustomDrawer from '../components/ui/CustomDrawer';

const AuthenticatedApp: React.FC = () => {
  return (
    <>
      <CustomDrawer />
      <Box ml={32}>
        <Switch>
          <Route path={routing.authenticated.dashboard.path} component={Dashboard} exact />
          <Route>
            <Redirect to={routing.authenticated.dashboard.path} />
          </Route>
        </Switch>
      </Box>
    </>
  );
};

export default AuthenticatedApp;
