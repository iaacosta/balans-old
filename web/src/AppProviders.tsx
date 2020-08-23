/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, CssBaseline, makeStyles, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as RouterProvider } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';

import './config/accounting';
import client from './config/apollo';
import { lightTheme, darkTheme } from './config/materialUi';
import { store, AppState } from './config/redux';
import { useBreakpoint } from './hooks/utils/useBreakpoint';

const useSnackbarClasses = makeStyles((theme) => ({
  variantInfo: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  variantWarning: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  variantError: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  variantSuccess: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

const useStyles = makeStyles((theme) => ({
  icon: { color: 'inherit', marginRight: theme.spacing(1) },
}));

const CustomThemeProvider: React.FC = ({ children }) => {
  const { themeType } = useSelector((state: AppState) => state.theme);

  return (
    <ThemeProvider theme={themeType === 'light' ? lightTheme : darkTheme}>{children}</ThemeProvider>
  );
};

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
    <Provider store={store}>
      <ApolloProvider client={client}>
        <CustomThemeProvider>
          <CustomSnackbarProvider>
            <CssBaseline />
            {children}
          </CustomSnackbarProvider>
        </CustomThemeProvider>
      </ApolloProvider>
    </Provider>
  </RouterProvider>
);

export default AppProviders;
