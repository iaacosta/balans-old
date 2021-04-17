/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchResult, MutationFunctionOptions, MutationTuple } from '@apollo/client';
import { ReactNode } from 'react';
import { Exact, Scalars } from './graphql';

export type ElementOf<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer Element>
  ? Element
  : never;

export type ArgumentOf<T> = T extends (...args: infer U) => any ? U : never;

export type MutationHandlerOptions = {
  errorMessageCallback?: (message: ReactNode) => unknown;
};

export type MutationSnackbarOptions = {
  noSnackbar?: boolean;
  successMessage?: ReactNode;
};

export type CustomMutateFunctionReturn<TData> =
  | FetchResult<TData, Record<string, unknown>, Record<string, unknown>>
  | undefined;

export type HandledMutationTuple<TData, TVariables> = [
  (
    options?: MutationFunctionOptions<TData, TVariables>,
  ) => Promise<CustomMutateFunctionReturn<TData>>,
  MutationTuple<TData, TVariables>[1],
];

export type InputMutationTuple<TData, TVariables extends { input: any }> = [
  (input: TVariables['input']) => Promise<CustomMutateFunctionReturn<TData>>,
  MutationTuple<TData, TVariables>[1],
];

export type IdMutationTuple<TData> = [
  (id: Scalars['ID']) => Promise<CustomMutateFunctionReturn<TData>>,
  MutationTuple<TData, Exact<{ id: Scalars['ID'] }>>[1],
];

export type InputMutationFunction<TInput, TExtend = Record<string, unknown>> = (
  input: TInput & TExtend,
  callback?: (() => void) | (() => Promise<void>),
) => Promise<void>;

export type UpdateInputMutationFunction<TInput extends { id: string }, TExtend = object> = (
  id: Scalars['ID'],
  input: Omit<TInput, 'id'> & TExtend,
  callback?: (() => void) | (() => Promise<void>),
) => Promise<void>;
