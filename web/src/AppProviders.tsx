/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, CssBaseline, makeStyles, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import './config/accounting';
import client from './config/apollo';
import customTheme from './config/materialUi';
import { baseStore } from './config/redux';
import { useBreakpoint } from './hooks/utils/useBreakpoint';

const useSnackbarClasses = makeStyles((theme) => ({
  variantInfo: { backgroundColor: theme.palette.info.main },
  variantWarning: { backgroundColor: theme.palette.warning.main },
  variantError: { backgroundColor: theme.palette.error.main },
  variantSuccess: { backgroundColor: theme.palette.success.main },
}));

const useStyles = makeStyles((theme) => ({
  icon: { color: theme.palette.background.default, marginRight: theme.spacing(1) },
}));

const CustomSnackbarProvider: React.FC = ({ children }) => {
  const snackbarClasses = useSnackbarClasses();
  const classes = useStyles();
  const notistackRef = createRef<any>();
  const isMobile = useBreakpoint({ layout: 'xs' });

  const handleDismiss = (key: any) => notistackRef.current.closeSnackbar(key);

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={4000}
      classes={snackbarClasses}
      ref={notistackRef}
      dense={isMobile}
      action={(key) => (
        <IconButton className={classes.icon} onClick={() => handleDismiss(key)} size="small">
          <CloseIcon />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
  );
};

const AppProviders: React.FC = ({ children }) => (
  <RouterProvider>
    <Provider store={baseStore}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={customTheme}>
          <CustomSnackbarProvider>
            <CssBaseline />
            {children}
          </CustomSnackbarProvider>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  </RouterProvider>
);

export default AppProviders;
