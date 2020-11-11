import { useMemo } from 'react';
import { QueryResult } from '@apollo/client';
import { useSnackbar } from 'notistack';
import {
  MyCategoriesQuery,
  MyCategoriesQueryVariables,
  CreateCategoryMutation,
  CreateCategoryMutationVariables,
  DeleteCategoryMutation,
} from '../../@types/graphql';
import { useRedirectedQuery, useInputMutation, UseIdMutationReturn, useIdMutation } from './utils';
import { InputMutationFunction, InputMutationTuple } from '../../@types/helpers';
import { useLocale } from '../utils/useLocale';
import { handleError } from '../../utils/errors';
import { createCategoryMutation, deleteCategoryMutation, myCategoriesQuery } from './queries';

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

type UseCreateCategoryMutationReturn = InputMutationTuple<
  CreateCategoryMutation,
  CreateCategoryMutationVariables
>;

type UseCreateCategoryReturn = [
  InputMutationFunction<CreateCategoryMutationVariables['input']>,
  UseCreateCategoryMutationReturn[1],
];

export const useCreateCategory = (): UseCreateCategoryReturn => {
  const { locale } = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta]: UseCreateCategoryMutationReturn = useInputMutation(createCategoryMutation, {
    refetchQueries: [{ query: myCategoriesQuery }],
  });

  const createCategory: UseCreateCategoryReturn[0] = async (values, callback) => {
    try {
      await mutate(values);
      enqueueSnackbar(
        locale('snackbars:success:created', { value: locale('elements:singular:category') }),
        { variant: 'success' },
      );
      if (callback) await callback();
    } catch (err) {
      handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
    }
  };

  return [createCategory, meta];
};

export const useDeleteCategory = (): UseIdMutationReturn<DeleteCategoryMutation> => {
  const { locale } = useLocale();

  return useIdMutation<DeleteCategoryMutation>(deleteCategoryMutation, {
    refetchQueries: [{ query: myCategoriesQuery }],
    snackbarMessage: locale('snackbars:success:deleted', {
      value: locale('elements:singular:category'),
    }),
  });
};
