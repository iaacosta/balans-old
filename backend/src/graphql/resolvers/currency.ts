import { getRepository } from 'typeorm';

import Currency from '../../models/Currency';
import { Resolvers } from '../../@types/common';

export default {
  Query: {
    getCurrencies: () => getRepository(Currency).find(),
    getCurrency: (parent, { id }) =>
      getRepository(Currency).find({ where: { id } }),
  },
  Mutation: {
    createCurrency: async (parent, { name }) => {
      const currency = new Currency(name);
      return getRepository(Currency).save(currency);
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
