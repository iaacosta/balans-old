import { createConnection, Connection, getConnection } from 'typeorm';
import dayjs from 'dayjs';
import {
  query,
  mutate,
  expense,
  getAccountById,
  getSubCategoryById,
  getPlaceById,
  seedTestDatabase,
  createPgClient,
} from '../../utils';
import { expenses } from '../../utils/data.json';
import Expense from '../../../models/Expense';

const {
  GET_EXPENSES,
  GET_EXPENSE,
  CREATE_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
} = expense;
console.log = jest.fn();

describe('expense API calls', () => {
  let connection: Connection;
  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
  });

  beforeEach(() => seedTestDatabase(pgClient));

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('getExpenses', () => {
    it('should get correct expenses', async () => {
      const { data } = await query({ query: GET_EXPENSES });
      expect(data!.getExpenses).toHaveLength(2);

      expenses.forEach((_expense, idx) => {
        let account: any = getAccountById(_expense.accountId)!;
        let subCategory: any = getSubCategoryById(_expense.subCategoryId)!;
        let place: any = getPlaceById(_expense.placeId)!;

        account = { ...account, id: account.id.toString() };
        subCategory = { ...subCategory, id: subCategory.id.toString() };
        place = { ...place, id: place.id.toString() };

        delete account.currencyId;
        delete subCategory.categoryId;

        expect(data!.getExpenses[idx]).toMatchObject({
          id: _expense.id.toString(),
          amount: _expense.amount,
          date: new Date(_expense.date).valueOf(),
          description: _expense.description,
          account,
          subCategory,
          place,
        });
      });
    });
  });

  describe('getExpense', () => {
    it('should get correct expense', async () => {
      const { data } = await query({
        query: GET_EXPENSE,
        variables: { id: 1 },
      });

      let account: any = getAccountById(expenses[0].accountId)!;
      let subCategory: any = getSubCategoryById(expenses[0].subCategoryId)!;
      let place: any = getPlaceById(expenses[0].placeId)!;
      account = { ...account, id: account.id.toString() };
      subCategory = { ...subCategory, id: subCategory.id.toString() };
      place = { ...place, id: place.id.toString() };
      delete account.currencyId;
      delete subCategory.categoryId;

      expect(data!.getExpense).toMatchObject({
        id: expenses[0].id.toString(),
        amount: expenses[0].amount,
        date: new Date(expenses[0].date).valueOf(),
        description: expenses[0].description,
        account,
        subCategory,
        place,
      });
    });
  });

  describe('createExpense', () => {
    it('should create a expense', async () => {
      const exampleAccount = {
        amount: 5000,
        date: 1577847600000,
        description: 'example',
        installments: 3,
        subCategoryId: 1,
        accountId: 3,
        placeId: 1,
      };

      await mutate({
        mutation: CREATE_EXPENSE,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(Expense)
        .createQueryBuilder('expense')
        .leftJoinAndSelect('expense.subCategory', 'subCategory')
        .leftJoinAndSelect('expense.account', 'account')
        .where('expense.amount = :amount', { amount: 5000 })
        .getOne();

      const subCategory = {
        ...getSubCategoryById(exampleAccount.subCategoryId),
      };
      const account = { ...getAccountById(exampleAccount.accountId) };

      delete subCategory.categoryId;
      delete account.currencyId;

      expect(result).not.toBeUndefined();
      expect(result).toMatchObject({
        amount: exampleAccount.amount,
        date: dayjs(exampleAccount.date),
        description: exampleAccount.description,
        subCategory,
        account,
      });
    });

    it('should not create a expense', async () => {
      const exampleAccount = {
        amount: 5000,
        date: 0,
        description: '',
        installments: 3,
        subCategoryId: 0,
        accountId: 1,
        placeId: 0,
      };

      await mutate({
        mutation: CREATE_EXPENSE,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(Expense)
        .createQueryBuilder('expense')
        .select()
        .where('expense.amount = :amount', { amount: 5000 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });

  describe('updateExpense', () => {
    it('should update an expense', async () => {
      await mutate({
        mutation: UPDATE_EXPENSE,
        variables: {
          id: 1,
          amount: 5000,
          accountId: 2,
        },
      });

      const result = await getConnection()
        .getRepository(Expense)
        .createQueryBuilder('expense')
        .leftJoinAndSelect('expense.subCategory', 'subCategory')
        .leftJoinAndSelect('expense.account', 'account')
        .where('expense.id = :id', { id: 1 })
        .getOne();

      const account = { ...getAccountById(2) };
      delete account.currencyId;

      expect(result).not.toBeUndefined();
      expect(result!.amount).toBe(5000);
      expect(result!.account).toMatchObject(account);
    });
  });

  describe('deleteCurrency', () => {
    it('should delete a expense', async () => {
      await mutate({
        mutation: DELETE_EXPENSE,
        variables: { id: 1 },
      });

      const result = await getConnection()
        .getRepository(Expense)
        .createQueryBuilder('expense')
        .select()
        .where('expense.id = :id', { id: 1 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });
});
