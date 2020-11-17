import { useInputMutation } from './utils';
import { CreatePassiveMutation, CreatePassiveMutationVariables } from '../../@types/graphql';
import { myAccountsQuery, createPassiveMutation } from './queries';
import { InputMutationFunction, InputMutationTuple } from '../../@types/helpers';
import { useLocale } from '../utils/useLocale';

type TExtends = { type: 'debt' | 'loan' };

type UseCreatePassiveMutationReturn = InputMutationTuple<
  CreatePassiveMutation,
  CreatePassiveMutationVariables
>;

type UseCreatePassiveReturn = [
  InputMutationFunction<CreatePassiveMutationVariables['input'], TExtends>,
  UseCreatePassiveMutationReturn[1],
];

export const useCreatePassive = (): UseCreatePassiveReturn => {
  const { locale } = useLocale();
  const [mutate, meta]: UseCreatePassiveMutationReturn = useInputMutation(createPassiveMutation, {
    successMessage: locale('snackbars:success:created', {
      value: locale('elements:singular:passive'),
    }),
    refetchQueries: [{ query: myAccountsQuery }],
  });

  const createPassive: UseCreatePassiveReturn[0] = async (
    { type, amount, issuedAt, ...values },
    callback,
  ) => {
    const response = await mutate({
      ...values,
      amount: type === 'debt' ? -amount : amount,
      issuedAt: issuedAt.valueOf(),
    });

    if (!response) return;
    if (callback) await callback();
  };

  return [createPassive, meta];
};
