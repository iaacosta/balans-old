/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationTuple } from '@apollo/client';

export type ElementOf<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementOf>
  ? ElementOf
  : never;

export type InputMutationTuple<TData, TVariables extends { input: any }> = [
  (input: TVariables['input']) => ReturnType<MutationTuple<TData, TVariables>[0]>,
  MutationTuple<TData, TVariables>[1],
];
