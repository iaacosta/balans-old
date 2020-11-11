import { useSnackbar } from 'notistack';
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
import { handleError } from '../../utils/errors';
import { useLocale } from '../utils/useLocale';

type UseLoginMutationReturn = InputMutationTuple<LoginMutation, LoginMutationVariables>;

type UseLoginReturn = [
  InputMutationFunction<LoginMutationVariables['input'], { rememberMe: boolean }>,
  UseLoginMutationReturn[1],
];

export const useLogin = (): UseLoginReturn => {
  const dispatch = useDispatch();
  const { locale } = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta]: UseLoginMutationReturn = useInputMutation(loginMutation);

  const login: UseLoginReturn[0] = async ({ rememberMe, ...values }, callback) => {
    try {
      const { data } = await mutate(values);

      if (data) {
        dispatch(addToken({ token: data.token }));
        if (rememberMe) localStorage.setItem('x-auth', data.token);
      } else {
        enqueueSnackbar(locale('snackbars:errors:unknown'), { variant: 'error' });
      }

      if (callback) await callback();
    } catch (err) {
      handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
    }
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
  const { locale } = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, meta]: UseSignUpMutationReturn = useInputMutation(signUpMutation);

  const signUp: UseSignUpReturn[0] = async ({ confirmPassword, ...values }, callback) => {
    try {
      const { data } = await mutate(values);

      if (data) {
        dispatch(addToken({ token: data.token }));
      } else {
        enqueueSnackbar(locale('snackbars:errors:unknown'), { variant: 'error' });
      }

      if (callback) await callback();
    } catch (err) {
      handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
    }
  };

  return [signUp, meta];
};
