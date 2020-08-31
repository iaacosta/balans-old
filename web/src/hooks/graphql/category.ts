import { useMemo } from 'react';
import { QueryResult } from '@apollo/client';
import {
  MyCategoriesQuery,
  MyCategoriesQueryVariables,
  CreateCategoryMutation,
  CreateCategoryMutationVariables,
} from '../../@types/graphql';
import { useRedirectedQuery, useInputMutation } from './utils';
import { myCategoriesQuery, createCategoryMutation } from '../../graphql/category';
import { InputMutationTuple } from '../../@types/helpers';

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

export const useCreateCategory = (): InputMutationTuple<
  CreateCategoryMutation,
  CreateCategoryMutationVariables
> =>
  useInputMutation(createCategoryMutation, {
    refetchQueries: [{ query: myCategoriesQuery }],
  });
