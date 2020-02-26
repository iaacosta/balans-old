import { getRepository, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';

import Currency from '../../models/Currency';
import CreditAccount from '../../models/CreditAccount';
import { currencyById } from './currency';
import { ResolverMap } from '../../@types';

type Queries = 'getCreditAccount' | 'getCreditAccounts';
type Mutations =
  | 'createCreditAccount'
  | 'updateCreditAccount'
  | 'deleteCreditAccount';
type Input = {
  id: number;
  name: string;
  bank: string;
  initialBalance: number;
  currencyId: number;
  billingDay: number;
  paymentDay: number;
};

export const creditAccountById = async (
  repo: Repository<CreditAccount>,
  id: number,
) => {
  const creditAccount = await repo.findOne(id, { relations: ['currency'] });
  if (!creditAccount) throw new Error('no credit account with such id');
  return creditAccountResolver(creditAccount);
};

export const creditAccountResolver = ({
  currency,
  ...creditAccount
}: CreditAccount) => ({
  ...creditAccount,
  currency: () => currencyById(getRepository(Currency), currency.id),
});

const resolvers: ResolverMap<Input, Queries, Mutations> = {
  Query: {
    getCreditAccounts: async () => {
      const accounts = await getRepository(CreditAccount).find({
        relations: ['currency'],
      });

      return accounts.map(creditAccountResolver);
    },
    getCreditAccount: (parent, { id }) =>
      creditAccountById(getRepository(CreditAccount), id),
  },
  Mutation: {
    createCreditAccount: async (
      parent,
      { name, bank, currencyId, initialBalance, billingDay, paymentDay },
    ) => {
      const currency = await getRepository(Currency).findOne(currencyId);
      if (!currency) throw new Error('no currency with such id');
      const account = new CreditAccount(
        name,
        bank,
        initialBalance,
        currency,
        billingDay,
        paymentDay,
      );

      await validateOrReject(account);
      return creditAccountResolver(
        await getRepository(CreditAccount).save(account),
      );
    },
    updateCreditAccount: async (
      parent,
      { id, name, bank, initialBalance, billingDay, paymentDay, currencyId },
    ) => {
      const repo = getRepository(CreditAccount);
      const account = await repo.findOne(id, { relations: ['currency'] });
      if (!account) throw new Error('no debit account with such id');

      /* Base attributes */
      if (name && account.name !== name) account.name = name;
      if (bank && account.bank !== bank) account.bank = bank;
      if (
        initialBalance !== undefined &&
        account.initialBalance !== initialBalance
      ) {
        account.initialBalance = initialBalance;
      }
      if (billingDay && account.billingDay !== billingDay) {
        account.billingDay = billingDay;
      }
      if (paymentDay && account.paymentDay !== paymentDay) {
        account.paymentDay = paymentDay;
      }

      /* Currency */
      if (currencyId && account.currency.id !== currencyId) {
        const currency = await getRepository(Currency).findOne(currencyId);
        if (!currency) throw new Error('no currency with such id');
        account.currency = currency;
      }

      await validateOrReject(account);
      return creditAccountResolver(await repo.save(account));
    },
    deleteCreditAccount: async (parent, { id }) => {
      const repo = getRepository(CreditAccount);
      const account = await repo.findOne(id);
      if (!account) throw new Error('no account with such id');
      await repo.remove(account);
      return id;
    },
  },
};

export default resolvers;
