import { currencies, debitAccounts } from './data.json';

export const getCurrencyById = (_id: number) =>
  currencies.find(({ id }) => id === _id);

export const getDebitAccountById = (_id: number) =>
  debitAccounts.find(({ id }) => id === _id);
