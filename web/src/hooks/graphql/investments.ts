import { QueryResult } from '@apollo/client';
import {
  MyFintualGoalsQuery,
  MyFintualGoalsQueryVariables,
  RegisterFintualCredentialsMutation,
  RegisterFintualCredentialsMutationVariables,
} from '../../@types/graphql';
import { useRedirectedQuery, useInputMutation } from './utils';
import { InputMutationFunction, InputMutationTuple } from '../../@types/helpers';
import { useLocale } from '../utils/useLocale';
import { registerFintualCredentialsMutation, myFintualGoalsQuery } from './queries';

export const useMyFintualGoals = (): Omit<
  QueryResult<MyFintualGoalsQuery, MyFintualGoalsQueryVariables>,
  'data'
> & { goals?: MyFintualGoalsQuery['goals'] } => {
  const { data, ...meta } = useRedirectedQuery<MyFintualGoalsQuery, MyFintualGoalsQueryVariables>(
    myFintualGoalsQuery,
    { notHandleError: true },
  );

  return { goals: data?.goals, ...meta };
};

type UseRegisterFintualCredentialsMutationReturn = InputMutationTuple<
  RegisterFintualCredentialsMutation,
  RegisterFintualCredentialsMutationVariables
>;

type UseRegisterFintualCredentialsReturn = [
  InputMutationFunction<RegisterFintualCredentialsMutationVariables['input']>,
  UseRegisterFintualCredentialsMutationReturn[1],
];

export const useRegisterFintualCredentials = (): UseRegisterFintualCredentialsReturn => {
  const { locale } = useLocale();
  const [mutate, meta]: UseRegisterFintualCredentialsMutationReturn = useInputMutation(
    registerFintualCredentialsMutation,
    {
      successMessage: locale('snackbars:success:registered', { value: 'Fintual' }),
      refetchQueries: [{ query: myFintualGoalsQuery }],
    },
  );

  const registerCredentials: UseRegisterFintualCredentialsReturn[0] = async (values, callback) => {
    const response = await mutate(values);
    if (!response) return;
    if (callback) await callback();
  };

  return [registerCredentials, meta];
};
