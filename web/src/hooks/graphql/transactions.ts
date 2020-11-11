import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
import { useIdMutation, UseIdMutationReturn, useRedirectedQuery, useInputMutation } from './utils';
import {
  DeleteTransactionMutation,
  MyTransactionsQuery,
  MyTransactionsQueryVariables,
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables,
} from '../../@types/graphql';
import {
  deleteTransactionMutation,
  myTransactionsQuery,
  createTransactionMutation,
  updateTransactionMutation,
} from '../../graphql/transaction';
import { myAccountsQuery } from './accounts';
import { InputMutationTuple } from '../../@types/helpers';

export const useMyTransactions = (): Omit<
  QueryResult<MyTransactionsQuery, MyTransactionsQueryVariables>,
  'data'
> & { transactions: MyTransactionsQuery['transactions'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myTransactionsQuery);
  const transactions = useMemo(() => data?.transactions || [], [data]);
  return { transactions, loading: loading || !data, ...meta };
};

export const useCreateTransaction = (): InputMutationTuple<
  CreateTransactionMutation,
  CreateTransactionMutationVariables
> =>
  useInputMutation(createTransactionMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
  });

export const useUpdateTransaction = (): InputMutationTuple<
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables
> =>
  useInputMutation(updateTransactionMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
  });

export const useDeleteTransaction = (): UseIdMutationReturn<DeleteTransactionMutation> => {
  return useIdMutation<DeleteTransactionMutation>(deleteTransactionMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    snackbarMessage: 'Transaction deleted successfully',
  });
};
