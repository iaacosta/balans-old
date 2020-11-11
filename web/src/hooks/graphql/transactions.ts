import { useMemo } from 'react';
import { QueryResult } from '@apollo/client';
import { useSnackbar } from 'notistack';
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
  myAccountsQuery,
  createTransactionMutation,
  deleteTransactionMutation,
  myTransactionsQuery,
  updateTransactionMutation,
} from './queries';
import {
  InputMutationFunction,
  InputMutationTuple,
  UpdateInputMutationFunction,
} from '../../@types/helpers';
import { useLocale } from '../utils/useLocale';
import { handleError } from '../../utils/errors';

export const useMyTransactions = (): Omit<
  QueryResult<MyTransactionsQuery, MyTransactionsQueryVariables>,
  'data'
> & { transactions: MyTransactionsQuery['transactions'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myTransactionsQuery);
  const transactions = useMemo(() => data?.transactions || [], [data]);
  return { transactions, loading: loading || !data, ...meta };
};

type TExtends = { type: 'income' | 'expense' };

type UseCreateTransactionMutationReturn = InputMutationTuple<
  CreateTransactionMutation,
  CreateTransactionMutationVariables
>;

type UseCreateTransactionReturn = [
  InputMutationFunction<CreateTransactionMutationVariables['input'], TExtends>,
  UseCreateTransactionMutationReturn[1],
];

export const useCreateTransaction = (): UseCreateTransactionReturn => {
  const { locale } = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta]: UseCreateTransactionMutationReturn = useInputMutation(
    createTransactionMutation,
    {
      refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    },
  );

  const createTransaction: UseCreateTransactionReturn[0] = async (
    { type, amount, issuedAt, ...values },
    callback,
  ) => {
    try {
      await mutate({
        ...values,
        amount: type === 'expense' ? -amount : amount,
        issuedAt: issuedAt.valueOf(),
      });
      enqueueSnackbar(
        locale('snackbars:success:created', { value: locale('elements:singular:transaction') }),
        { variant: 'success' },
      );
      if (callback) await callback();
    } catch (err) {
      handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
    }
  };

  return [createTransaction, meta];
};

type UseUpdateTransactionMutationReturn = InputMutationTuple<
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables
>;

type UseUpdateTransactionReturn = [
  UpdateInputMutationFunction<UpdateTransactionMutationVariables['input']>,
  UseUpdateTransactionMutationReturn[1],
];

export const useUpdateTransaction = (): UseUpdateTransactionReturn => {
  const { locale } = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta]: UseUpdateTransactionMutationReturn = useInputMutation(
    updateTransactionMutation,
    {
      refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    },
  );

  const updateTransaction: UseUpdateTransactionReturn[0] = async (id, input, callback) => {
    try {
      await mutate({ id, ...input, issuedAt: input.issuedAt?.valueOf() });
      enqueueSnackbar(
        locale('snackbars:success:updated', { value: locale('elements:singular:transaction') }),
        { variant: 'success' },
      );
      if (callback) await callback();
    } catch (err) {
      handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
    }
  };

  return [updateTransaction, meta];
};

export const useDeleteTransaction = (): UseIdMutationReturn<DeleteTransactionMutation> => {
  const { locale } = useLocale();

  return useIdMutation<DeleteTransactionMutation>(deleteTransactionMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    snackbarMessage: locale('snackbars:success:deleted', {
      value: locale('elements:singular:transaction'),
    }),
  });
};
