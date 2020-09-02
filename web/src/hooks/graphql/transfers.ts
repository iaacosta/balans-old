import { useMemo } from 'react';
import { QueryResult } from '@apollo/client';
import { InputMutationTuple } from '../../@types/helpers';
import { createTransferMutation, myTransfersQuery } from '../../graphql/transfer';
import { myAccountsQuery } from '../../graphql/account';
import {
  CreateTransferMutationVariables,
  CreateTransferMutation,
  MyTransfersQuery,
  MyTransfersQueryVariables,
} from '../../@types/graphql';
import { useInputMutation, useRedirectedQuery } from './utils';

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
