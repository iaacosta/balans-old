/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  DocumentNode,
  QueryHookOptions,
  QueryResult,
  useMutation,
  MutationHookOptions,
} from '@apollo/client';
import { ReactNode, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import routing from '../../constants/routing';
import {
  MutationHandlerOptions,
  MutationSnackbarOptions,
  HandledMutationTuple,
  IdMutationTuple,
  InputMutationTuple,
} from '../../@types/helpers';
import { handleError } from '../../utils/errors';
import { useLocale } from '../utils/useLocale';
import { Scalars } from '../../@types/graphql';

export const useRedirectedQuery = <TData = any, TVariables = any>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables> & MutationHandlerOptions,
): QueryResult<TData, TVariables> => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const queryData = useQuery<TData, TVariables>(query, options);

  useEffect(() => {
    if (queryData.error) {
      if (!options?.notHandleError) {
        handleError(
          queryData.error,
          options?.errorMessageCallback ||
            ((message: React.ReactNode) => enqueueSnackbar(message, { variant: 'error' })),
        );
        history.push(routing.authenticated.dashboard);
      }
    }
  }, [options, queryData.error, history, enqueueSnackbar]);

  return queryData;
};

export const useHandledMutation = <TData, TVariables>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables> &
    MutationHandlerOptions &
    MutationSnackbarOptions,
): HandledMutationTuple<TData, TVariables> => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta] = useMutation<TData, TVariables>(mutation, options);

  return [
    async (mutationOptions) => {
      try {
        const response = await mutate(mutationOptions);
        return response;
      } catch (err) {
        const errorCallback =
          options?.errorMessageCallback ||
          ((body: ReactNode) => enqueueSnackbar(body, { variant: 'error' }));

        handleError(err, errorCallback);
        return undefined;
      }
    },
    meta,
  ];
};

export const useIdMutation = <TData>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, { id: Scalars['ID'] }> &
    MutationHandlerOptions &
    MutationSnackbarOptions,
): IdMutationTuple<TData> => {
  const { enqueueSnackbar } = useSnackbar();
  const { locale } = useLocale();
  const [mutate, meta] = useHandledMutation<TData, { id: Scalars['ID'] }>(mutation, options);
  return [
    async (id) => {
      const response = await mutate({ variables: { id } });
      if (!response) return undefined;
      const successMessage = options?.successMessage || locale('snackbars:success:done');
      enqueueSnackbar(successMessage, { variant: 'success' });
      return response;
    },
    meta,
  ];
};

export const useInputMutation = <TData, TVariables extends { input: any }>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables> &
    MutationHandlerOptions &
    MutationSnackbarOptions,
): InputMutationTuple<TData, TVariables> => {
  const { enqueueSnackbar } = useSnackbar();
  const { locale } = useLocale();
  const [mutate, meta] = useHandledMutation<TData, TVariables>(mutation, options);
  return [
    async (input) => {
      const response = await mutate({ variables: { input } as any });
      if (!response) return undefined;
      if (!options?.noSnackbar) {
        const successMessage = options?.successMessage || locale('snackbars:success:done');
        enqueueSnackbar(successMessage, { variant: 'success' });
      }
      return response;
    },
    meta,
  ];
};
