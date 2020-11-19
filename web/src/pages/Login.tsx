import React from 'react';
import { Typography, Hidden } from '@material-ui/core';
import AuthWrapper from '../components/authenticate/AuthWrapper';
import { useLocale } from '../hooks/utils/useLocale';
import LoginForm from '../components/authenticate/LoginForm';

const Login: React.FC = () => {
  const { locale } = useLocale();

  return (
    <AuthWrapper>
      <Typography variant="h2">{locale('auth:loginPage:title')}</Typography>
      <Hidden xsDown>
        <Typography variant="subtitle1">{locale('auth:loginPage:subtitle')}</Typography>
      </Hidden>
      <LoginForm />
    </AuthWrapper>
  );
};

export default Login;
