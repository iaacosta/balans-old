import { useMutation, MutationTuple, DocumentNode, MutationHookOptions } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Scalars, Exact } from '../../@types/graphql';

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
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    },
    meta,
  ];
};
