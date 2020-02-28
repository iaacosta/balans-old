import { getRepository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import Currency from '../../models/Currency';
import { ResolverMap } from '../../@types';
import { accountsById } from './account';

type Queries = 'getCurrency' | 'getCurrencies';
type Mutations = 'createCurrency' | 'updateCurrency' | 'deleteCurrency';
type Input = { id: number; name: string };

export const currencyById = async (id: number) => {
  const currency = await getRepository(Currency).findOne(id, {
    relations: ['accounts'],
  });
  if (!currency) throw new Error('no currency with such id');
  return currencyResolver(currency);
};

export const currencyResolver = ({ accounts, ...currency }: Currency) => ({
  ...currency,
  accounts: () => accountsById(accounts.map(({ id }) => id)),
});

const resolvers: ResolverMap<Input, Queries, Mutations> = {
  Query: {
    getCurrencies: async () => {
      const currencies = await getRepository(Currency).find({
        relations: ['accounts'],
        order: { id: 1 },
      });

      return currencies.map((currency) => currencyResolver(currency));
    },
    getCurrency: async (parent, { id }) => currencyById(id),
  },
  Mutation: {
    createCurrency: async (parent, { name }) => {
      const currency = new Currency(name);
      await validateOrReject(currency);
      return getRepository(Currency).save(currency);
    },
    updateCurrency: async (parent, { id, name }) => {
      const repo = getRepository(Currency);
      const currency = await repo.findOne(id);
      if (!currency) throw new Error('no currency with such id');
      if (currency.name !== name) currency.name = name;
      await validateOrReject(currency);
      return currencyResolver(await repo.save(currency));
    },
    deleteCurrency: async (parent, { id }) => {
      const repo = getRepository(Currency);
      const currency = await repo.findOne(id);
      if (!currency) throw new Error('no currency with such id');
      await getRepository(Currency).remove(currency);
      return id;
    },
  },
};

export default resolvers;
