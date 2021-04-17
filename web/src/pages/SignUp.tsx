import React from 'react';
import { Typography, Hidden } from '@material-ui/core';

import AuthWrapper from '../components/authenticate/AuthWrapper';
import { useLocale } from '../hooks/utils/useLocale';
import SignUpForm from '../components/authenticate/SignUpForm';

const SignUp: React.FC = () => {
  const { locale } = useLocale();

  return (
    <AuthWrapper>
      <Typography variant="h2">{locale('auth:signUpPage:title')}</Typography>
      <Hidden xsDown>
        <Typography variant="subtitle1">{locale('auth:signUpPage:subtitle')}</Typography>
      </Hidden>
      <SignUpForm />
    </AuthWrapper>
  );
};

export default SignUp;
