import { useMemo } from 'react';
import { QueryResult } from '@apollo/client';
import {
  MyCategoriesQuery,
  MyCategoriesQueryVariables,
  CreateCategoryMutation,
  CreateCategoryMutationVariables,
  DeleteCategoryMutation,
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables,
} from '../../@types/graphql';
import { useRedirectedQuery, useInputMutation, useIdMutation } from './utils';
import {
  IdMutationTuple,
  InputMutationFunction,
  InputMutationTuple,
  UpdateInputMutationFunction,
} from '../../@types/helpers';
import { useLocale } from '../utils/useLocale';
import {
  createCategoryMutation,
  deleteCategoryMutation,
  myCategoriesQuery,
  updateCategoryMutation,
} from './queries';

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
  const [mutate, meta]: UseCreateCategoryMutationReturn = useInputMutation(createCategoryMutation, {
    successMessage: locale('snackbars:success:created', {
      value: locale('elements:singular:category'),
    }),
    refetchQueries: [{ query: myCategoriesQuery }],
  });

  const createCategory: UseCreateCategoryReturn[0] = async (values, callback) => {
    const response = await mutate(values);
    if (!response) return;
    if (callback) await callback();
  };

  return [createCategory, meta];
};

type UseUpdateCategoryMutationReturn = InputMutationTuple<
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables
>;

type UseUpdateCategoryReturn = [
  UpdateInputMutationFunction<UpdateCategoryMutationVariables['input']>,
  UseUpdateCategoryMutationReturn[1],
];

export const useUpdateCategory = (): UseUpdateCategoryReturn => {
  const { locale } = useLocale();
  const [mutate, meta]: UseUpdateCategoryMutationReturn = useInputMutation(updateCategoryMutation, {
    successMessage: locale('snackbars:success:updated', {
      value: locale('elements:singular:category'),
    }),
  });

  const updateCategory: UseUpdateCategoryReturn[0] = async (id, values, callback) => {
    const response = await mutate({ id, ...values });
    if (!response) return;
    if (callback) await callback();
  };

  return [updateCategory, meta];
};

export const useDeleteCategory = (): IdMutationTuple<DeleteCategoryMutation> => {
  const { locale } = useLocale();

  return useIdMutation<DeleteCategoryMutation>(deleteCategoryMutation, {
    refetchQueries: [{ query: myCategoriesQuery }],
    successMessage: locale('snackbars:success:deleted', {
      value: locale('elements:singular:category'),
    }),
  });
};
