import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import client from './config/apollo';
import theme from './config/materialUi';
import { baseStore } from './config/redux';

const AppProviders: React.FC = ({ children }) => {
  return (
    <RouterProvider>
      <Provider store={baseStore}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={2} autoHideDuration={2000}>
              <CssBaseline />
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
    </RouterProvider>
  );
};

export default AppProviders;
