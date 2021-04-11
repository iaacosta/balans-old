import { QueryResult } from '@apollo/client';
import { ClpUsdExchangeRateQuery, ClpUsdExchangeRateQueryVariables } from '../../@types/graphql';
import { useRedirectedQuery } from './utils';
import { clpUsdExchangeRateQuery } from './queries';

export const useClpUsdExchangeRate = (): Omit<
  QueryResult<ClpUsdExchangeRateQuery, ClpUsdExchangeRateQueryVariables>,
  'data'
> & { clpUsdExchangeRate: number } => {
  const { data, loading, ...meta } = useRedirectedQuery<
    ClpUsdExchangeRateQuery,
    ClpUsdExchangeRateQueryVariables
  >(clpUsdExchangeRateQuery);

  return { clpUsdExchangeRate: data?.clpUsdExchangeRate || 0, loading: loading || !data, ...meta };
};
