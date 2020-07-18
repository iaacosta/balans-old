import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as RouterProvider } from 'react-router-dom';

import client from './config/apollo';
import theme from './config/materialUi';

const AppProviders: React.FC = ({ children }) => {
  return (
    <RouterProvider>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={2} autoHideDuration={1500}>
            <CssBaseline />
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </ApolloProvider>
    </RouterProvider>
  );
};

export default AppProviders;
