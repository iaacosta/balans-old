import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Box, makeStyles } from '@material-ui/core';

import routing from '../constants/routing';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const UnauthenticatedApp: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.main}>
      <Switch>
        <Route path={routing.unauthenticated.login} component={Login} exact />
        <Route path={routing.unauthenticated.signUp} component={SignUp} exact />
        <Route>
          <Redirect to={routing.unauthenticated.login} />
        </Route>
      </Switch>
    </Box>
  );
};

export default UnauthenticatedApp;
