import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';

import { APOLLO_URL, PASSWORD } from 'react-native-dotenv';

const link = createUploadLink({
  uri: APOLLO_URL,
  headers: { Authorization: `Password ${PASSWORD}` },
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
