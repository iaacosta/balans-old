import { useIdMutation, UseIdMutationReturn } from './useIdMutation';
import { DeleteTransactionMutation } from '../../@types/graphql';
import { deleteTransactionMutation, myTransactionsQuery } from '../../graphql/transaction';
import { myAccountsQuery } from '../../graphql/account';

export const useDeleteTransaction = (): UseIdMutationReturn<DeleteTransactionMutation> => {
  return useIdMutation<DeleteTransactionMutation>(deleteTransactionMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    snackbarMessage: 'Transaction deleted successfully',
  });
};
