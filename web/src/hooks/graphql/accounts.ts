import { QueryResult } from '@apollo/client';
import { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import {
  MyAccountsQuery,
  MyAccountsQueryVariables,
  DeleteDebitAccountMutation,
  CreateDebitAccountMutation,
  CreateDebitAccountMutationVariables,
} from '../../@types/graphql';
import { useIdMutation, UseIdMutationReturn, useRedirectedQuery, useInputMutation } from './utils';
import {
  createDebitAccountMutation,
  deleteDebitAccountMutation,
  myAccountsQuery,
  myTransactionsQuery,
} from './queries';
import { InputMutationFunction, InputMutationTuple } from '../../@types/helpers';
import { handleError } from '../../utils/errors';
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
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta]: UseCreateDebitAccountMutationReturn = useInputMutation(
    createDebitAccountMutation,
    {
      refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    },
  );

  const createDebitAccount: UseCreateDebitAccountReturn[0] = async (values, callback) => {
    try {
      await mutate(values);
      enqueueSnackbar(
        locale('snackbars:success:created', { value: locale('elements:singular:account') }),
        { variant: 'success' },
      );
      if (callback) await callback();
    } catch (err) {
      handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
    }
  };

  return [createDebitAccount, meta];
};

export const useDeleteDebitAccount = (): UseIdMutationReturn<DeleteDebitAccountMutation> => {
  const { locale } = useLocale();
  return useIdMutation<DeleteDebitAccountMutation>(deleteDebitAccountMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    snackbarMessage: locale('snackbars:success:deleted', {
      value: locale('elements:singular:account'),
    }),
  });
};
