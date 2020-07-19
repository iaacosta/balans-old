import React from 'react';
import { useSelector } from 'react-redux';

import UnauthenticatedApp from './routers/UnauthenticatedApp';
import AuthenticatedApp from './routers/AuthenticatedApp';

const App: React.FC = () => {
  const token = useSelector((state: { token: string }) => state.token);
  return token ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
