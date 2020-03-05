import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/react-hooks';
import { AppRegistry } from 'react-native';

import App from './App';
import { name as appName } from './app.json';
import client from './config/apollo';
import './config/numeral';

const AppWrapper = () => (
  <NavigationContainer>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </NavigationContainer>
);

AppRegistry.registerComponent(appName, () => AppWrapper);
