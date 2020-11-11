import { useMemo } from 'react';
import { QueryResult, MutationTuple, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { InputMutationTuple } from '../../@types/helpers';
import {
  createTransferMutation,
  myTransfersQuery,
  deleteTransferMutation,
} from '../../graphql/transfer';
import { myAccountsQuery } from './accounts';
import {
  CreateTransferMutationVariables,
  CreateTransferMutation,
  MyTransfersQuery,
  MyTransfersQueryVariables,
  DeleteTransferMutation,
  DeleteTransferMutationVariables,
} from '../../@types/graphql';
import { useInputMutation, useRedirectedQuery } from './utils';
import { handleError } from '../../utils/errors';

export const useMyTransfers = (): Omit<
  QueryResult<MyTransfersQuery, MyTransfersQueryVariables>,
  'data'
> & { transfers: MyTransfersQuery['transfers'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myTransfersQuery);
  const transfers = useMemo(() => data?.transfers || [], [data]);
  return { transfers, loading: loading || !data, ...meta };
};

export const useCreateTransfer = (): InputMutationTuple<
  CreateTransferMutation,
  CreateTransferMutationVariables
> =>
  useInputMutation(createTransferMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransfersQuery }],
  });

export const useDeleteTransfer = (): [
  (operationId: string) => Promise<void>,
  MutationTuple<DeleteTransferMutation, DeleteTransferMutationVariables>[1],
] => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta] = useMutation<DeleteTransferMutation, DeleteTransferMutationVariables>(
    deleteTransferMutation,
    { refetchQueries: [{ query: myAccountsQuery }, { query: myTransfersQuery }] },
  );

  return [
    async (operationId) => {
      try {
        await mutate({ variables: { operationId } });
        enqueueSnackbar('Transfer deleted successfully', {
          variant: 'success',
        });
      } catch (err) {
        handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
      }
    },
    meta,
  ];
};
