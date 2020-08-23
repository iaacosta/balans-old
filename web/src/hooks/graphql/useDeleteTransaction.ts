import { useMutation, MutationTuple } from '@apollo/client';
import { useSnackbar } from 'notistack';
import {
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables,
  Scalars,
} from '../../@types/graphql';
import { deleteTransactionMutation, myTransactionsQuery } from '../../graphql/transaction';
import { myAccountsQuery } from '../../graphql/account';

type CustomMutationHook = [
  (id: Scalars['ID']) => Promise<void>,
  MutationTuple<DeleteTransactionMutation, DeleteTransactionMutationVariables>[1],
];

export const useDeleteTransaction = (): CustomMutationHook => {
  const { enqueueSnackbar } = useSnackbar();
  const [deleteTransaction, meta] = useMutation(deleteTransactionMutation, {
    refetchQueries: [{ query: myTransactionsQuery }, { query: myAccountsQuery }],
  });

  return [
    async (id) => {
      try {
        await deleteTransaction({ variables: { id } });
        enqueueSnackbar('Transaction deleted successfully', { variant: 'success' });
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    },
    meta,
  ];
};
