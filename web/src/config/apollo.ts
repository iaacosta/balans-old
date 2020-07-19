/* eslint-disable no-console */
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { capitalize } from 'lodash';
import { baseStore } from './redux';

const baseLink = new HttpLink({
  uri: process.env.API_URL || 'http://localhost:5000/graphql',
});

const contextLink = setContext((_, { headers }) => {
  const { token } = baseStore.getState();
  if (token) return { headers: { ...headers, Authorization: `Bearer ${token}` } };
  return { headers };
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors && process.env.NODE_ENV !== 'production')
    graphQLErrors.forEach(({ message }, idx) => {
      // eslint-disable-next-line no-param-reassign
      graphQLErrors[idx].message = capitalize(message);
    });
});

const client = new ApolloClient({
  link: ApolloLink.from([contextLink, errorLink, baseLink]),
  cache: new InMemoryCache(),
});

export default client;
