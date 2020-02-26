/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createConnection, Connection, getConnection } from 'typeorm';
import {
  query,
  mutate,
  seedCurrencies,
  seedCreditAccounts,
  creditAccount,
  getCurrencyById,
} from '../../utils';
import { creditAccounts } from '../../utils/data.json';
import CreditAccount from '../../../models/CreditAccount';

const {
  GET_CREDIT_ACCOUNTS,
  GET_CREDIT_ACCOUNT,
  CREATE_CREDIT_ACCOUNT,
  UPDATE_CREDIT_ACCOUNT,
  DELETE_CREDIT_ACCOUNT,
} = creditAccount;
console.log = jest.fn();

describe('credit account API calls', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(() => seedCurrencies().then(seedCreditAccounts));
  afterAll(() => connection.close());

  describe('getCreditAccounts', () => {
    it('should get correct credit accounts', async () => {
      const { data } = await query({ query: GET_CREDIT_ACCOUNTS });
      expect(data!.getCreditAccounts).toHaveLength(2);

      creditAccounts.forEach((acc, idx) => {
        expect(data!.getCreditAccounts[idx]).toMatchObject({
          name: acc.name,
          bank: acc.bank,
          initialBalance: acc.initialBalance,
          billingDay: acc.billingDay,
          paymentDay: acc.paymentDay,
          currency: {
            ...getCurrencyById(acc.currencyId)!,
            id: acc.currencyId.toString(),
          },
        });
      });
    });
  });

  describe('getCreditAccount', () => {
    it('should get correct credit account', async () => {
      const { data } = await query({
        query: GET_CREDIT_ACCOUNT,
        variables: { id: 1 },
      });

      expect(data!.getCreditAccount).toMatchObject({
        id: '1',
        name: creditAccounts[0].name,
        bank: creditAccounts[0].bank,
        initialBalance: creditAccounts[0].initialBalance,
        billingDay: creditAccounts[0].billingDay,
        paymentDay: creditAccounts[0].paymentDay,
      });
    });
  });

  describe('createCreditAccount', () => {
    it('should create a credit account', async () => {
      const exampleAccount = {
        name: 'Created credit account',
        bank: 'Bank',
        initialBalance: 0,
        billingDay: 1,
        paymentDay: 2,
        currencyId: 1,
      };

      await mutate({
        mutation: CREATE_CREDIT_ACCOUNT,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(CreditAccount)
        .createQueryBuilder('credit_acount')
        .leftJoinAndSelect('credit_acount.currency', 'currency')
        .where('credit_acount.name = :name', { name: 'Created credit account' })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result).toMatchObject({
        name: exampleAccount.name,
        bank: exampleAccount.bank,
        initialBalance: exampleAccount.initialBalance,
        billingDay: exampleAccount.billingDay,
        paymentDay: exampleAccount.paymentDay,
        currency: getCurrencyById(exampleAccount.currencyId),
      });
    });

    it('should not create a credit account', async () => {
      const exampleAccount = {
        name: '',
        bank: '',
        initialBalance: 0,
        currencyId: 1,
        billingDay: 0,
        paymentDay: 1000,
      };

      await mutate({
        mutation: CREATE_CREDIT_ACCOUNT,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(CreditAccount)
        .createQueryBuilder('credit_acount')
        .leftJoinAndSelect('credit_acount.currency', 'currency')
        .where('credit_acount.name = :name', { name: 'Created credit account' })
        .getOne();

      expect(result).toBeUndefined();
    });
  });

  describe('updateCreditAccount', () => {
    it('should update an account', async () => {
      await mutate({
        mutation: UPDATE_CREDIT_ACCOUNT,
        variables: { id: 1, name: 'Modified credit account', currencyId: 2 },
      });

      const result = await getConnection()
        .getRepository(CreditAccount)
        .createQueryBuilder('credit_acount')
        .leftJoinAndSelect('credit_acount.currency', 'currency')
        .where('credit_acount.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('Modified credit account');
      expect(result!.currency).toMatchObject(getCurrencyById(2)!);
    });

    it('should not update an account', async () => {
      await mutate({
        mutation: UPDATE_CREDIT_ACCOUNT,
        variables: {
          id: 1,
          billingDay: 300,
          paymentDay: 300,
          name: '',
          bank: '',
          currencyId: 2,
        },
      });

      const result = await getConnection()
        .getRepository(CreditAccount)
        .createQueryBuilder('credit_acount')
        .leftJoinAndSelect('credit_acount.currency', 'currency')
        .where('credit_acount.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('Example account 1');
      expect(result!.currency).toMatchObject(getCurrencyById(1)!);
    });
  });

  describe('deleteCurrency', () => {
    it('should delete a currency', async () => {
      await mutate({
        mutation: DELETE_CREDIT_ACCOUNT,
        variables: { id: 1 },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('credit_acount')
        .from(CreditAccount, 'credit_acount')
        .where('credit_acount.id = :id', { id: 1 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });
});
