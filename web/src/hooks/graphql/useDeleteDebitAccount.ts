import { useIdMutation, UseIdMutationReturn } from './useIdMutation';
import { DeleteDebitAccountMutation } from '../../@types/graphql';
import { myTransactionsQuery } from '../../graphql/transaction';
import { myAccountsQuery, deleteDebitAccountMutation } from '../../graphql/account';

export const useDeleteDebitAccount = (): UseIdMutationReturn<DeleteDebitAccountMutation> => {
  return useIdMutation<DeleteDebitAccountMutation>(deleteDebitAccountMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
    snackbarMessage: 'Account deleted successfully',
  });
};
