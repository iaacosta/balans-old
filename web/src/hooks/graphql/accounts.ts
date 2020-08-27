import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
import {
  MyAccountsQuery,
  MyAccountsQueryVariables,
  DeleteDebitAccountMutation,
} from '../../@types/graphql';
import { myAccountsQuery, deleteDebitAccountMutation } from '../../graphql/account';
import { useIdMutation, UseIdMutationReturn, useRedirectedQuery } from './utils';
import { myTransactionsQuery } from '../../graphql/transaction';

export const useMyDebitAccounts = (): Omit<
  QueryResult<MyAccountsQuery, MyAccountsQueryVariables>,
  'data'
> & { accounts: MyAccountsQuery['accounts'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myAccountsQuery);
  const accounts = useMemo(() => data?.accounts || [], [data]);
  return { accounts, loading: loading || !data, ...meta };
};

export const useDeleteDebitAccount = (): UseIdMutationReturn<DeleteDebitAccountMutation> =>
  useIdMutation<DeleteDebitAccountMutation>(deleteDebitAccountMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    snackbarMessage: 'Account deleted successfully',
  });
