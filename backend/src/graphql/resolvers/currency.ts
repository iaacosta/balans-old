import { getRepository, Repository } from 'typeorm';

import Currency from '../../models/Currency';
import { Resolvers } from '../../@types/common';
import { debitAccountById } from './account';
import DebitAccount from '../../models/DebitAccount';

export const currencyById = async (repo: Repository<Currency>, id: number) => {
  const currency = await repo.findOne(id, { relations: ['debitAccounts'] });
  if (!currency) throw new Error('no currency with such id');
  return currencyResolver(currency);
};

export const currencyResolver = ({ debitAccounts, ...currency }: Currency) => ({
  ...currency,
  debitAccounts: () =>
    debitAccounts.map(({ id }) =>
      debitAccountById(getRepository(DebitAccount), id),
    ),
});

export default {
  Query: {
    getCurrencies: async () => {
      const currencies = await getRepository(Currency).find();
      return currencies.map(currencyResolver);
    },
    getCurrency: async (parent, { id }) =>
      currencyById(getRepository(Currency), id),
  },
  Mutation: {
    createCurrency: async (parent, { name }) => {
      const curr = new Currency(name);
      return getRepository(Currency).save(curr);
    },
    updateCurrency: async (parent, { id, name }) => {
      await getRepository(Currency).update(id, { name });
      return id;
    },
    deleteCurrency: async (parent, { id }) => {
      await getRepository(Currency).delete(id);
      return id;
    },
  },
} as { Query: Resolvers<Currency>; Mutation: Resolvers<Currency> };
