import { InputMutationTuple } from '../../@types/helpers';
import {
  LoginMutation,
  LoginMutationVariables,
  SignUpMutation,
  SignUpMutationVariables,
} from '../../@types/graphql';
import { useInputMutation } from './utils';
import { loginMutation, signUpMutation } from '../../graphql/authentication';

export const useLogin = (): InputMutationTuple<LoginMutation, LoginMutationVariables> =>
  useInputMutation(loginMutation);

export const useSignUp = (): InputMutationTuple<SignUpMutation, SignUpMutationVariables> =>
  useInputMutation(signUpMutation);
