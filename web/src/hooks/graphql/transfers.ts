import { InputMutationTuple } from '../../@types/helpers';
import { createTransferMutation } from '../../graphql/transfer';
import { myAccountsQuery } from '../../graphql/account';
import { CreateTransferMutationVariables, CreateTransferMutation } from '../../@types/graphql';
import { useInputMutation } from './utils';

export const useCreateTransfer = (): InputMutationTuple<
  CreateTransferMutation,
  CreateTransferMutationVariables
> =>
  useInputMutation(createTransferMutation, {
    refetchQueries: [{ query: myAccountsQuery }],
  });
