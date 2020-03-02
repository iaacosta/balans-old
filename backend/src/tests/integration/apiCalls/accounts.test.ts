import { createConnection, Connection, getConnection } from 'typeorm';
import {
  query,
  mutate,
  seedCurrencies,
  seedAccounts,
  account,
  getCurrencyById,
  getIncomesRelated,
  seedSubCategories,
  seedIncomes,
  seedCategories,
  getExpensesRelated,
  seedPlaces,
  seedExpenses,
} from '../../utils';
import { accounts } from '../../utils/data.json';
import Account from '../../../models/Account';

const {
  GET_ACCOUNTS,
  GET_ACCOUNT,
  CREATE_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
} = account;
console.log = jest.fn();

describe('debit account API calls', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(() =>
    seedCurrencies()
      .then(seedAccounts)
      .then(seedCategories)
      .then(seedSubCategories)
      .then(seedPlaces)
      .then(seedIncomes)
      .then(seedExpenses),
  );

  afterAll(() => connection.close());

  describe('getAccounts', () => {
    it('should get correct debit accounts', async () => {
      const { data } = await query({ query: GET_ACCOUNTS });
      expect(data!.getAccounts).toHaveLength(3);

      accounts.forEach((acc, idx) => {
        const currency = getCurrencyById(acc.currencyId)!;
        const incomes = getIncomesRelated(acc.id, 'account')!;
        const expenses = getExpensesRelated(acc.id, 'account')!;

        expect(data!.getAccounts[idx]).toMatchObject({
          type: acc.type,
          name: acc.name,
          bank: acc.bank,
          initialBalance: acc.initialBalance,
          paymentDay: acc.paymentDay,
          billingDay: acc.billingDay,
          currency: { ...currency, id: acc.currencyId.toString() },
          incomes,
          expenses,
        });
      });
    });
  });

  describe('getAccount', () => {
    it('should get correct debit account', async () => {
      const { data } = await query({
        query: GET_ACCOUNT,
        variables: { id: 1 },
      });

      const currency = getCurrencyById(accounts[0].currencyId);
      const incomes = getIncomesRelated(accounts[0].id, 'account')!;
      const expenses = getExpensesRelated(accounts[0].id, 'account')!;

      expect(data!.getAccount).toMatchObject({
        id: '1',
        type: accounts[0].type,
        name: accounts[0].name,
        bank: accounts[0].bank,
        initialBalance: accounts[0].initialBalance,
        paymentDay: accounts[0].paymentDay,
        billingDay: accounts[0].billingDay,
        currency: { ...currency, id: accounts[0].currencyId.toString() },
        incomes,
        expenses,
      });
    });
  });

  describe('createAccount', () => {
    it('should create a debit account', async () => {
      const exampleAccount = {
        type: 'checking',
        name: 'Created debit account',
        bank: 'Bank',
        initialBalance: -10,
        currencyId: 1,
      };

      await mutate({
        mutation: CREATE_ACCOUNT,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(Account)
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.currency', 'currency')
        .where('account.name = :name', { name: 'Created debit account' })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result).toMatchObject({
        type: exampleAccount.type,
        name: exampleAccount.name,
        bank: exampleAccount.bank,
        initialBalance: exampleAccount.initialBalance,
        currency: getCurrencyById(exampleAccount.currencyId),
        billingDay: 0,
        paymentDay: 0,
      });
    });

    it('should create a credit account', async () => {
      const exampleAccount = {
        type: 'credit',
        name: 'Created credit account',
        bank: 'Bank',
        initialBalance: -10,
        currencyId: 1,
        billingDay: 1,
        paymentDay: 15,
      };

      await mutate({
        mutation: CREATE_ACCOUNT,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(Account)
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.currency', 'currency')
        .where('account.name = :name', { name: 'Created credit account' })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result).toMatchObject({
        type: exampleAccount.type,
        name: exampleAccount.name,
        bank: exampleAccount.bank,
        initialBalance: exampleAccount.initialBalance,
        currency: getCurrencyById(exampleAccount.currencyId),
        billingDay: exampleAccount.billingDay,
        paymentDay: exampleAccount.paymentDay,
      });
    });

    it('should not create a debit account', async () => {
      const exampleAccount = {
        type: 'cash',
        name: 'Not valid',
        bank: '',
        initialBalance: -10,
        currencyId: 1,
      };

      await mutate({
        mutation: CREATE_ACCOUNT,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(Account)
        .createQueryBuilder('debit_account')
        .leftJoinAndSelect('debit_account.currency', 'currency')
        .where('debit_account.name = :name', { name: 'Not valid' })
        .getOne();

      expect(result).toBeUndefined();
    });

    it('should not create a credit account', async () => {
      const exampleAccount = {
        type: 'credit',
        name: 'Not valid',
        bank: '',
        initialBalance: 0,
        currencyId: 1,
      };

      await mutate({
        mutation: CREATE_ACCOUNT,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(Account)
        .createQueryBuilder('debit_account')
        .leftJoinAndSelect('debit_account.currency', 'currency')
        .where('debit_account.name = :name', { name: 'Not valid' })
        .getOne();

      expect(result).toBeUndefined();
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      await mutate({
        mutation: UPDATE_ACCOUNT,
        variables: { id: 1, name: 'Modified account', currencyId: 2 },
      });

      const result = await getConnection()
        .getRepository(Account)
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.currency', 'currency')
        .where('account.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('Modified account');
      expect(result!.currency).toMatchObject(getCurrencyById(2)!);
    });
  });

  describe('deleteAccount', () => {
    it('should delete a currency', async () => {
      await mutate({
        mutation: DELETE_ACCOUNT,
        variables: { id: 1 },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('account')
        .from(Account, 'account')
        .where('account.id = :id', { id: 1 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });
});
