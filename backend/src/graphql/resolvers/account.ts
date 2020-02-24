import { getRepository, Repository } from 'typeorm';

import DebitAccount from '../../models/DebitAccount';
import { Resolvers } from '../../@types/common';
import Currency from '../../models/Currency';
import { currencyById } from './currency';

type Input = {
  id: number;
  name: string;
  bank: string;
  initialBalance: number;
  allowsNegative: boolean;
  currencyId: number;
};

export const debitAccountById = async (
  repo: Repository<DebitAccount>,
  id: number,
) => {
  const debitAccount = await repo.findOne(id, { relations: ['currency'] });
  if (!debitAccount) throw new Error('no currency with this id');
  return debitAccountResolver(debitAccount);
};

export const debitAccountResolver = ({
  currency,
  ...debitAccount
}: DebitAccount) => ({
  ...debitAccount,
  currency: () => currencyById(getRepository(Currency), currency.id),
});

export default {
  Query: {
    getDebitAccounts: async () => {
      const accounts = await getRepository(DebitAccount).find({
        relations: ['currency'],
      });

      return accounts.map(debitAccountResolver);
    },
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
