import { createConnection, Connection, getConnection } from 'typeorm';
import dayjs from 'dayjs';
import {
  query,
  mutate,
  income,
  getAccountById,
  getSubCategoryById,
  seedTestDatabase,
  createPgClient,
} from '../../utils';
import { incomes } from '../../utils/data.json';
import Income from '../../../models/Income';

const {
  GET_INCOMES,
  GET_INCOME,
  CREATE_INCOME,
  UPDATE_INCOME,
  DELETE_INCOME,
} = income;
console.log = jest.fn();

describe('income API calls', () => {
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

  describe('getIncomes', () => {
    it('should get correct incomes', async () => {
      const { data } = await query({ query: GET_INCOMES });
      expect(data!.getIncomes).toHaveLength(2);

      incomes.forEach((_income, idx) => {
        let account: any = getAccountById(_income.accountId)!;
        let subCategory: any = getSubCategoryById(_income.subCategoryId)!;

        account = { ...account, id: account.id.toString() };
        subCategory = { ...subCategory, id: subCategory.id.toString() };

        delete account.currencyId;
        delete subCategory.categoryId;

        expect(data!.getIncomes[idx]).toMatchObject({
          id: _income.id.toString(),
          amount: _income.amount,
          date: new Date(_income.date).valueOf(),
          description: _income.description,
          account,
          subCategory,
        });
      });
    });
  });

  describe('getIncome', () => {
    it('should get correct income', async () => {
      const { data } = await query({
        query: GET_INCOME,
        variables: { id: 1 },
      });

      let account: any = getAccountById(incomes[0].accountId)!;
      let subCategory: any = getSubCategoryById(incomes[0].subCategoryId)!;
      account = { ...account, id: account.id.toString() };
      subCategory = { ...subCategory, id: subCategory.id.toString() };
      delete account.currencyId;
      delete subCategory.categoryId;

      expect(data!.getIncome).toMatchObject({
        id: incomes[0].id.toString(),
        amount: incomes[0].amount,
        date: new Date(incomes[0].date).valueOf(),
        description: incomes[0].description,
        account,
        subCategory,
      });
    });
  });

  describe('createIncome', () => {
    it('should create a income', async () => {
      const exampleAccount = {
        amount: 5000,
        date: 1577847600000,
        description: 'example',
        subCategoryId: 1,
        accountId: 1,
      };

      await mutate({
        mutation: CREATE_INCOME,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(Income)
        .createQueryBuilder('income')
        .leftJoinAndSelect('income.subCategory', 'subCategory')
        .leftJoinAndSelect('income.account', 'account')
        .where('income.amount = :amount', { amount: 5000 })
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

    it('should not create a income', async () => {
      const exampleAccount = {
        amount: 5000,
        date: 0,
        description: '',
        subCategoryId: 0,
        accountId: 0,
      };

      await mutate({
        mutation: CREATE_INCOME,
        variables: exampleAccount,
      });

      const result = await getConnection()
        .getRepository(Income)
        .createQueryBuilder('income')
        .select()
        .where('income.amount = :amount', { amount: 5000 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });

  describe('updateIncome', () => {
    it('should update an income', async () => {
      await mutate({
        mutation: UPDATE_INCOME,
        variables: {
          id: 1,
          amount: 5000,
          accountId: 2,
        },
      });

      const result = await getConnection()
        .getRepository(Income)
        .createQueryBuilder('income')
        .leftJoinAndSelect('income.subCategory', 'subCategory')
        .leftJoinAndSelect('income.account', 'account')
        .where('income.amount = :amount', { amount: 5000 })
        .getOne();

      const account = { ...getAccountById(2) };
      delete account.currencyId;

      expect(result).not.toBeUndefined();
      expect(result!.amount).toBe(5000);
      expect(result!.account).toMatchObject(account);
    });
  });

  describe('deleteCurrency', () => {
    it('should delete a income', async () => {
      await mutate({
        mutation: DELETE_INCOME,
        variables: { id: 2 },
      });

      const result = await getConnection()
        .getRepository(Income)
        .createQueryBuilder('income')
        .select()
        .where('income.id = :id', { id: 2 })
        .getOne();

      expect(result).toBeUndefined();
    });
  });
});
