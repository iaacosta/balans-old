import { useDispatch } from 'react-redux';
import { InputMutationFunction, InputMutationTuple } from '../../@types/helpers';
import {
  LoginMutation,
  LoginMutationVariables,
  SignUpMutation,
  SignUpMutationVariables,
} from '../../@types/graphql';
import { useInputMutation } from './utils';
import { loginMutation, signUpMutation } from './queries';
import { addToken } from '../../slices/authSlice';

type UseLoginMutationReturn = InputMutationTuple<LoginMutation, LoginMutationVariables>;

type UseLoginReturn = [
  InputMutationFunction<LoginMutationVariables['input'], { rememberMe: boolean }>,
  UseLoginMutationReturn[1],
];

export const useLogin = (): UseLoginReturn => {
  const dispatch = useDispatch();
  const [mutate, meta]: UseLoginMutationReturn = useInputMutation(loginMutation);

  const login: UseLoginReturn[0] = async ({ rememberMe, ...values }, callback) => {
    const response = await mutate(values);
    if (!response) return;

    if (response.data) {
      dispatch(addToken({ token: response.data.token }));
      if (rememberMe) localStorage.setItem('x-auth', response.data.token);
    }

    if (callback) await callback();
  };

  return [login, meta];
};

type UseSignUpMutationReturn = InputMutationTuple<SignUpMutation, SignUpMutationVariables>;

type UseSignUpReturn = [
  InputMutationFunction<SignUpMutationVariables['input'], { confirmPassword: string }>,
  UseSignUpMutationReturn[1],
];

export const useSignUp = (): UseSignUpReturn => {
  const dispatch = useDispatch();
  const [mutate, meta]: UseSignUpMutationReturn = useInputMutation(signUpMutation);

  const signUp: UseSignUpReturn[0] = async ({ confirmPassword, ...values }, callback) => {
    const response = await mutate(values);
    if (!response) return;

    if (response?.data) dispatch(addToken({ token: response.data.token }));
    if (callback) await callback();
  };

  return [signUp, meta];
};
