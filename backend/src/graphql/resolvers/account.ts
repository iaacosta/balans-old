import { getRepository } from 'typeorm';

import DebitAccount from '../../models/DebitAccount';
import { Resolvers } from '../../@types/common';
import Currency from '../../models/Currency';

type Input = {
  id: number;
  name: string;
  bank: string;
  initialBalance: number;
  allowsNegative: boolean;
  currencyId: number;
};

export default {
  Query: {
    getDebitAccounts: () =>
      getRepository(DebitAccount).find({
        relations: ['currency'],
      }),
  },
  Mutation: {
    createDebitAccount: async (
      parent,
      { name, bank, allowsNegative, currencyId, initialBalance },
    ) => {
      const currency = await getRepository(Currency).findOneOrFail(currencyId);
      const acc = new DebitAccount(
        name,
        bank,
        initialBalance,
        allowsNegative,
        currency,
      );
      return getRepository(DebitAccount).save(acc);
    },
  },
} as { Query: Resolvers<Input>; Mutation: Resolvers<Input> };
