import { getRepository, Repository } from 'typeorm';

import DebitAccount from '../../models/DebitAccount';
import Currency from '../../models/Currency';
import CreditAccount from '../../models/CreditAccount';
import { currencyById } from './currency';
import { Resolvers } from '../../@types/common';

type DebitAccountInput = {
  id: number;
  name: string;
  bank: string;
  initialBalance: number;
  allowsNegative: boolean;
  currencyId: number;
};

type CreditAccountInput = {
  id: number;
  name: string;
  bank: string;
  initialBalance: number;
  currencyId: number;
  billingDay: number;
  paymentDay: number;
};

export const debitAccountById = async (
  repo: Repository<DebitAccount>,
  id: number,
) => {
  const debitAccount = await repo.findOne(id, { relations: ['currency'] });
  if (!debitAccount) throw new Error('no debit account with such id');
  return debitAccountResolver(debitAccount);
};

export const creditAccountById = async (
  repo: Repository<CreditAccount>,
  id: number,
) => {
  const creditAccount = await repo.findOne(id, { relations: ['currency'] });
  if (!creditAccount) throw new Error('no credit account with such id');
  return creditAccountResolver(creditAccount);
};

export const debitAccountResolver = ({
  currency,
  ...debitAccount
}: DebitAccount) => ({
  ...debitAccount,
  currency: () => currencyById(getRepository(Currency), currency.id),
});

export const creditAccountResolver = ({
  currency,
  ...creditAccount
}: CreditAccount) => ({
  ...creditAccount,
  currency: () => currencyById(getRepository(Currency), currency.id),
});

const debitAccountResolvers = {
  Query: {
    getDebitAccounts: async () => {
      const accounts = await getRepository(DebitAccount).find({
        relations: ['currency'],
      });

      return accounts.map(debitAccountResolver);
    },
    getDebitAccount: (parent, { id }) =>
      debitAccountById(getRepository(DebitAccount), id),
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

      return debitAccountResolver(await getRepository(DebitAccount).save(acc));
    },
    updateDebitAccount: async (
      parent,
      { id, name, bank, initialBalance, currencyId },
    ) => {
      const repo = getRepository(DebitAccount);
      const account = await repo.findOne(id, { relations: ['currency'] });
      if (!account) throw new Error('no debit account with such id');

      /* Base attributes */
      if (name && account.name !== name) account.name = name;
      if (bank && account.bank !== bank) account.bank = bank;
      if (initialBalance && account.initialBalance !== initialBalance) {
        account.initialBalance = initialBalance;
      }

      /* Currency */
      if (account.currency.id !== currencyId) {
        const currency = await getRepository(Currency).findOne(currencyId);
        if (!currency) throw new Error('no currency with such id');
        account.currency = currency;
      }

      return debitAccountResolver(await repo.save(account));
    },
    deleteDebitAccount: async (parent, { id }) => {
      const repo = getRepository(DebitAccount);
      const account = await repo.findOne(id);
      if (!account) throw new Error('no account with such id');
      await repo.remove(account);
      return id;
    },
  },
} as {
  Query: Resolvers<DebitAccountInput>;
  Mutation: Resolvers<DebitAccountInput>;
};

const creditAccountResolvers = {
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
      const currency = await getRepository(Currency).findOneOrFail(currencyId);
      const acc = new CreditAccount(
        name,
        bank,
        initialBalance,
        currency,
        billingDay,
        paymentDay,
      );

      return creditAccountResolver(
        await getRepository(CreditAccount).save(acc),
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
      if (initialBalance && account.initialBalance !== initialBalance) {
        account.initialBalance = initialBalance;
      }
      if (billingDay && account.billingDay !== billingDay) {
        account.billingDay = billingDay;
      }
      if (paymentDay && account.paymentDay !== paymentDay) {
        account.paymentDay = paymentDay;
      }

      /* Currency */
      if (account.currency.id !== currencyId) {
        const currency = await getRepository(Currency).findOne(currencyId);
        if (!currency) throw new Error('no currency with such id');
        account.currency = currency;
      }

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
} as {
  Query: Resolvers<CreditAccountInput>;
  Mutation: Resolvers<CreditAccountInput>;
};

export default {
  Query: {
    ...debitAccountResolvers.Query,
    ...creditAccountResolvers.Query,
  },
  Mutation: {
    ...debitAccountResolvers.Mutation,
    ...creditAccountResolvers.Mutation,
  },
};
