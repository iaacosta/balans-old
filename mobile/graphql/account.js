import gql from 'graphql-tag';

export const GET_HOME_ACCOUNTS = gql`
  query {
    getAccounts {
      balance
      notBilled
    }
  }
`;
