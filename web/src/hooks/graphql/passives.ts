import { useMemo } from 'react';
import { QueryResult } from '@apollo/client';
import { useInputMutation, useRedirectedQuery } from './utils';
import {
  CreatePassiveMutation,
  CreatePassiveMutationVariables,
  LiquidatePassiveMutation,
  LiquidatePassiveMutationVariables,
  MyPassivesQuery,
  MyPassivesQueryVariables,
} from '../../@types/graphql';
import {
  myAccountsQuery,
  createPassiveMutation,
  liquidatePassiveMutation,
  myPassivesQuery,
} from './queries';
import {
  InputMutationFunction,
  InputMutationTuple,
  UpdateInputMutationFunction,
} from '../../@types/helpers';
import { useLocale } from '../utils/useLocale';

export const useMyPassives = (): Omit<
  QueryResult<MyPassivesQuery, MyPassivesQueryVariables>,
  'data'
> & { passives: MyPassivesQuery['passives'] } => {
  const { data, loading, ...meta } = useRedirectedQuery(myPassivesQuery);
  const passives = useMemo(() => data?.passives || [], [data]);
  return { passives, loading: loading || !data, ...meta };
};

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

type UseLiquidatePassiveMutationReturn = InputMutationTuple<
  LiquidatePassiveMutation,
  LiquidatePassiveMutationVariables
>;

type UseLiquidatePassiveReturn = [
  UpdateInputMutationFunction<LiquidatePassiveMutationVariables['input']>,
  UseLiquidatePassiveMutationReturn[1],
];

export const useLiquidatePassive = (): UseLiquidatePassiveReturn => {
  const { locale } = useLocale();
  const [mutate, meta]: UseLiquidatePassiveMutationReturn = useInputMutation(
    liquidatePassiveMutation,
    {
      successMessage: locale('snackbars:success:liquidated', {
        value: locale('elements:singular:passive'),
      }),
      refetchQueries: [{ query: myAccountsQuery }],
    },
  );

  const liquidatePassive: UseLiquidatePassiveReturn[0] = async (id, input, callback) => {
    const response = await mutate({ id, ...input });
    if (!response) return;
    if (callback) await callback();
  };

  return [liquidatePassive, meta];
};
