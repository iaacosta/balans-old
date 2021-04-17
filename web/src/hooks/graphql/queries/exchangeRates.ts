import { gql } from '@apollo/client';

export const clpUsdExchangeRateQuery = gql`
  query ClpUsdExchangeRate {
    clpUsdExchangeRate
  }
`;
