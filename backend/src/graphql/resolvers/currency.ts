import { getRepository, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import Currency from '../../models/Currency';
import { Resolvers } from '../../@types';
import { creditAccountById } from './creditAccount';
import { debitAccountById } from './debitAccount';
import DebitAccount from '../../models/DebitAccount';
import CreditAccount from '../../models/CreditAccount';

export const currencyById = async (repo: Repository<Currency>, id: number) => {
  const currency = await repo.findOne(id, {
    relations: ['debitAccounts', 'creditAccounts'],
  });
  if (!currency) throw new Error('no currency with such id');
  return currencyResolver(currency);
};

export const currencyResolver = ({
  debitAccounts,
  creditAccounts,
  ...currency
}: Currency) => ({
  ...currency,
  debitAccounts: () =>
    debitAccounts.map(({ id }) =>
      debitAccountById(getRepository(DebitAccount), id),
    ),
  creditAccounts: () =>
    creditAccounts.map(({ id }) =>
      creditAccountById(getRepository(CreditAccount), id),
    ),
});

export default {
  Query: {
    getCurrencies: async () => {
      const currencies = await getRepository(Currency).find({
        relations: ['debitAccounts', 'creditAccounts'],
        order: { id: 1 },
      });

      return currencies.map(currencyResolver);
    },
    getCurrency: async (parent, { id }) =>
      currencyById(getRepository(Currency), id),
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
} as { Query: Resolvers<Currency>; Mutation: Resolvers<Currency> };
