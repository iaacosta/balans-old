import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
import {
  MyAccountsQuery,
  MyAccountsQueryVariables,
  DeleteDebitAccountMutation,
  CreateDebitAccountMutation,
  CreateDebitAccountMutationVariables,
} from '../../@types/graphql';
import { useIdMutation, useRedirectedQuery, useInputMutation } from './utils';
import {
  createDebitAccountMutation,
  deleteDebitAccountMutation,
  myAccountsQuery,
  myTransactionsQuery,
} from './queries';
import { IdMutationTuple, InputMutationFunction, InputMutationTuple } from '../../@types/helpers';
import { useLocale } from '../utils/useLocale';

export const useMyDebitAccounts = (): Omit<
  QueryResult<MyAccountsQuery, MyAccountsQueryVariables>,
  'data'
> & { accounts: MyAccountsQuery['accounts'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myAccountsQuery);
  const accounts = useMemo(() => data?.accounts || [], [data]);
  return { accounts, loading: loading || !data, ...meta };
};

type UseCreateDebitAccountMutationReturn = InputMutationTuple<
  CreateDebitAccountMutation,
  CreateDebitAccountMutationVariables
>;

type UseCreateDebitAccountReturn = [
  InputMutationFunction<CreateDebitAccountMutationVariables['input']>,
  UseCreateDebitAccountMutationReturn[1],
];

export const useCreateDebitAccount = (): UseCreateDebitAccountReturn => {
  const { locale } = useLocale();
  const [mutate, meta]: UseCreateDebitAccountMutationReturn = useInputMutation(
    createDebitAccountMutation,
    {
      successMessage: locale('snackbars:success:created', {
        value: locale('elements:singular:account'),
      }),
      refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    },
  );

  const createDebitAccount: UseCreateDebitAccountReturn[0] = async (values, callback) => {
    const response = await mutate(values);
    if (response && callback) await callback();
  };

  return [createDebitAccount, meta];
};

export const useDeleteDebitAccount = (): IdMutationTuple<DeleteDebitAccountMutation> => {
  const { locale } = useLocale();
  return useIdMutation<DeleteDebitAccountMutation>(deleteDebitAccountMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    successMessage: locale('snackbars:success:deleted', {
      value: locale('elements:singular:account'),
    }),
  });
};
