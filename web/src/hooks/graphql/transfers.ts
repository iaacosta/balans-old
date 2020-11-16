import { useMemo } from 'react';
import { QueryResult, MutationTuple, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { InputMutationFunction, InputMutationTuple } from '../../@types/helpers';
import {
  myAccountsQuery,
  createTransferMutation,
  myTransfersQuery,
  deleteTransferMutation,
} from './queries';
import {
  CreateTransferMutationVariables,
  CreateTransferMutation,
  MyTransfersQuery,
  MyTransfersQueryVariables,
  DeleteTransferMutation,
  DeleteTransferMutationVariables,
} from '../../@types/graphql';
import { useInputMutation, useRedirectedQuery } from './utils';
import { useLocale } from '../utils/useLocale';

export const useMyTransfers = (): Omit<
  QueryResult<MyTransfersQuery, MyTransfersQueryVariables>,
  'data'
> & { transfers: MyTransfersQuery['transfers'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myTransfersQuery);
  const transfers = useMemo(() => data?.transfers || [], [data]);
  return { transfers, loading: loading || !data, ...meta };
};

type UseCreateTransferMutationReturn = InputMutationTuple<
  CreateTransferMutation,
  CreateTransferMutationVariables
>;

type UseCreateTransferReturn = [
  InputMutationFunction<CreateTransferMutationVariables['input']>,
  UseCreateTransferMutationReturn[1],
];

export const useCreateTransfer = (): UseCreateTransferReturn => {
  const { locale } = useLocale();
  const [mutate, meta]: UseCreateTransferMutationReturn = useInputMutation(createTransferMutation, {
    successMessage: locale('snackbars:success:created', {
      value: locale('elements:singular:transfer'),
    }),
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransfersQuery }],
  });

  const createTransfer: UseCreateTransferReturn[0] = async (values, callback) => {
    const response = await mutate({ ...values, issuedAt: values.issuedAt.valueOf() });
    if (!response) return;

    if (callback) callback();
  };

  return [createTransfer, meta];
};

type UseDeleteTransferReturn = [
  (operationId: string) => Promise<void>,
  MutationTuple<DeleteTransferMutation, DeleteTransferMutationVariables>[1],
];

export const useDeleteTransfer = (): UseDeleteTransferReturn => {
  const { locale } = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta] = useMutation<DeleteTransferMutation, DeleteTransferMutationVariables>(
    deleteTransferMutation,
    {
      refetchQueries: [{ query: myAccountsQuery }, { query: myTransfersQuery }],
    },
  );

  const deleteTransfer: UseDeleteTransferReturn[0] = async (operationId) => {
    const response = await mutate({ variables: { operationId } });
    if (!response) return;
    enqueueSnackbar(
      locale('snackbars:success:deleted', { value: locale('elements:singular:transfer') }),
      { variant: 'success' },
    );
  };

  return [deleteTransfer, meta];
};
