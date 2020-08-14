/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, DocumentNode, QueryHookOptions, QueryResult } from '@apollo/client';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import routing from '../constants/routing';

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
