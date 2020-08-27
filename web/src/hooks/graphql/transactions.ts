import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
import { useIdMutation, UseIdMutationReturn, useRedirectedQuery } from './utils';
import {
  DeleteTransactionMutation,
  MyTransactionsQuery,
  MyTransactionsQueryVariables,
} from '../../@types/graphql';
import { deleteTransactionMutation, myTransactionsQuery } from '../../graphql/transaction';
import { myAccountsQuery } from '../../graphql/account';

export const useMyTransactions = (): Omit<
  QueryResult<MyTransactionsQuery, MyTransactionsQueryVariables>,
  'data'
> & { transactions: MyTransactionsQuery['transactions'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myTransactionsQuery);
  const transactions = useMemo(() => data?.transactions || [], [data]);
  return { transactions, loading: loading || !data, ...meta };
};

export const useDeleteTransaction = (): UseIdMutationReturn<DeleteTransactionMutation> => {
  return useIdMutation<DeleteTransactionMutation>(deleteTransactionMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    snackbarMessage: 'Transaction deleted successfully',
  });
};
