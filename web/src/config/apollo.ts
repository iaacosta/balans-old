/* eslint-disable no-console */
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const baseLink = new HttpLink({
  uri: process.env.API_URL || 'http://localhost:5000/graphql',
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors && process.env.NODE_ENV !== 'production')
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    );
});

const client = new ApolloClient({
  link: from([baseLink, errorLink]),
  cache: new InMemoryCache(),
});

export default client;
