import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import UnauthenticatedApp from './routers/UnauthenticatedApp';
import AuthenticatedApp from './routers/AuthenticatedApp';
import { AppState } from './config/redux';

const App: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { token, tokenExpired } = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    if (tokenExpired) enqueueSnackbar('Session expired', { variant: 'warning' });
  }, [tokenExpired, enqueueSnackbar]);

  return token ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
