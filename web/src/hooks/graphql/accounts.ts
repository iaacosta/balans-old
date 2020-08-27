import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
import {
  MyAccountsQuery,
  MyAccountsQueryVariables,
  DeleteDebitAccountMutation,
  CreateDebitAccountMutation,
  CreateDebitAccountMutationVariables,
} from '../../@types/graphql';
import {
  myAccountsQuery,
  deleteDebitAccountMutation,
  createDebitAccountMutation,
} from '../../graphql/account';
import { useIdMutation, UseIdMutationReturn, useRedirectedQuery, useInputMutation } from './utils';
import { myTransactionsQuery } from '../../graphql/transaction';
import { InputMutationTuple } from '../../@types/helpers';

export const useMyDebitAccounts = (): Omit<
  QueryResult<MyAccountsQuery, MyAccountsQueryVariables>,
  'data'
> & { accounts: MyAccountsQuery['accounts'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myAccountsQuery);
  const accounts = useMemo(() => data?.accounts || [], [data]);
  return { accounts, loading: loading || !data, ...meta };
};

export const useCreateDebitAccount = (): InputMutationTuple<
  CreateDebitAccountMutation,
  CreateDebitAccountMutationVariables
> =>
  useInputMutation(createDebitAccountMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
  });

export const useDeleteDebitAccount = (): UseIdMutationReturn<DeleteDebitAccountMutation> =>
  useIdMutation<DeleteDebitAccountMutation>(deleteDebitAccountMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    snackbarMessage: 'Account deleted successfully',
  });
