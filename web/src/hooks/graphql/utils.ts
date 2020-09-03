/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  DocumentNode,
  QueryHookOptions,
  QueryResult,
  useMutation,
  MutationTuple,
  MutationHookOptions,
} from '@apollo/client';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import routing from '../../constants/routing';
import { Scalars, Exact } from '../../@types/graphql';
import { InputMutationTuple } from '../../@types/helpers';
import { handleError } from '../../utils/errors';

export type IdMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type UseIdMutationReturn<TData> = [
  (id: Scalars['ID']) => Promise<void>,
  MutationTuple<TData, IdMutationVariables>[1],
];

export const useIdMutation = <TData extends Record<string, unknown>>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, IdMutationVariables> & { snackbarMessage?: string },
): UseIdMutationReturn<TData> => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta] = useMutation<TData, IdMutationVariables>(mutation, options);

  return [
    async (id) => {
      try {
        await mutate({ variables: { id } });
        enqueueSnackbar(options?.snackbarMessage || 'Action done successfully', {
          variant: 'success',
        });
      } catch (err) {
        handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
      }
    },
    meta,
  ];
};

export const useRedirectedQuery = <TData = any, TVariables = any>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const queryData = useQuery<TData, TVariables>(query, options);

  useEffect(() => {
    if (queryData.error) {
      enqueueSnackbar(queryData.error.message, { variant: 'error' });
      history.push(routing.authenticated.dashboard);
    }
  }, [queryData.error, history, enqueueSnackbar]);

  return queryData;
};

export const useInputMutation = <TData, TVariables extends { input: any }>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>,
): InputMutationTuple<TData, TVariables> => {
  const [mutate, meta] = useMutation<TData, TVariables>(mutation, options);
  return [(input) => mutate({ variables: { input } as any }), meta];
};
