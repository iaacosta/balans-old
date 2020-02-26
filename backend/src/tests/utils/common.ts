import { currencies, debitAccounts, creditAccounts } from './data.json';

export const getCurrencyById = (_id: number) =>
  currencies.find(({ id }) => id === _id);

export const getDebitAccountById = (_id: number) =>
  debitAccounts.find(({ id }) => id === _id);

export const getCreditAccountById = (_id: number) =>
  creditAccounts.find(({ id }) => id === _id);
