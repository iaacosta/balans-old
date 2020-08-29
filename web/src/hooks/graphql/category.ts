import { useMemo } from 'react';
import { QueryResult } from '@apollo/client';
import { MyCategoriesQuery, MyCategoriesQueryVariables } from '../../@types/graphql';
import { useRedirectedQuery } from './utils';
import { myCategoriesQuery } from '../../graphql/category';

export const useMyCategories = (): Omit<
  QueryResult<MyCategoriesQuery, MyCategoriesQueryVariables>,
  'data'
> & { income: MyCategoriesQuery['income']; expense: MyCategoriesQuery['expense'] } => {
  const { data, loading, ...meta } = useRedirectedQuery<
    MyCategoriesQuery,
    MyCategoriesQueryVariables
  >(myCategoriesQuery);
  const income = useMemo(() => data?.income || [], [data]);
  const expense = useMemo(() => data?.expense || [], [data]);
  return { income, expense, loading: loading || !data, ...meta };
};
