import { createConnection, Connection, Repository } from 'typeorm';
import dayjs from 'dayjs';

import { seedTestDatabase, createPgClient } from '../../utils';
import { expenses } from '../../utils/data.json';
import Expense from '../../../models/Expense';
import Account from '../../../models/_Account';
import SubCategory from '../../../models/SubCategory';
import Place from '../../../models/Place';
import Currency from '../../../models/Currency';
import Income from '../../../models/Income';
import { AccountType } from '../../../@types';

console.log = jest.fn();

describe('Expense ORM tests', () => {
  let account: Account;
  let subCategory: SubCategory;
  let place: Place;
  let connection: Connection;
  let repo: Repository<Expense>;
  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
    repo = connection.getRepository(Expense);
  });

  beforeEach(async () => {
    await seedTestDatabase(pgClient);
    account = (await connection.getRepository(Account).findOne(2))!;
    subCategory = (await connection.getRepository(SubCategory).findOne())!;
    place = (await connection.getRepository(Place).findOne())!;
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('dates', () => {
    it('should parse date correctly on load', async () => {
      const expense = await repo.findOne(expenses[0].id);
      expect(expense).toBeTruthy();
      expect(expense!.date).toStrictEqual(dayjs(expenses[0].date));
    });

    it('should serialize date correctly on save', async () => {
      await repo.save(
        new Expense(
          1234,
          dayjs('2020-01-01T00:00:00.000Z'),
          account,
          subCategory,
          place,
        ),
      );

      const [
        { date },
      ] = await connection.query(
        'SELECT date FROM expense WHERE amount = $1;',
        [1234],
      );

      expect(date.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    });
  });

  describe('subscribers', () => {
    const reloadAccount = async (type: string) => {
      account = (await connection.getRepository(Account).findOne({
        where: { name: 'Example Subscriber', type },
        relations: ['expenses', 'incomes'],
      }))!;
    };

    const createAccount = async (type: AccountType, initialBalance = 0) =>
      connection
        .getRepository(Account)
        .save(
          new Account(
            type,
            'Example Subscriber',
            'Example',
            initialBalance,
            (await connection.getRepository(Currency).findOne())!,
            1,
            5,
          ),
        );

    describe('create', () => {
      beforeEach(async () => {
        await createAccount('cash', 100);
        await reloadAccount('cash');
      });

      it('should not create an expense if type cash and balance < amount', async () => {
        const expense = new Expense(200, dayjs(), account, subCategory, place);
        expect(repo.save(expense)).rejects.toBeTruthy();
      });

      it('should create an expense if type cash and balance = amount', async () => {
        const expense = new Expense(100, dayjs(), account, subCategory, place);
        expect(repo.save(expense)).resolves.toBeTruthy();
      });

      it('should create an expense if type cash and balance > amount', async () => {
        const expense = new Expense(50, dayjs(), account, subCategory, place);
        expect(repo.save(expense)).resolves.toBeTruthy();
      });
    });

    describe('update', () => {
      it('should not update an expense if credit and |balance| < change amount', async () => {
        await createAccount('credit');
        await reloadAccount('credit');

        let expense = new Expense(200, dayjs(), account, subCategory, place);
        await repo.save(expense);
        await reloadAccount('credit');

        const income = new Income(100, dayjs(), account, subCategory);
        await connection.getRepository(Income).save(income);

        expense = (await repo.findOne(expense.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expense.amount = 50;

        expect(repo.save(expense)).rejects.toBeTruthy();
      });

      it('should update an expense if credit and |balance| = change amount', async () => {
        await createAccount('credit');
        await reloadAccount('credit');

        let expense = new Expense(200, dayjs(), account, subCategory, place);
        await repo.save(expense);
        await reloadAccount('credit');

        const income = new Income(100, dayjs(), account, subCategory);
        await connection.getRepository(Income).save(income);

        expense = (await repo.findOne(expense.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expense.amount = 100;

        expect(repo.save(expense)).resolves.toBeTruthy();
      });

      it('should not update an expense if cash and balance < change amount', async () => {
        await createAccount('cash');
        await reloadAccount('cash');

        const income = new Income(100, dayjs(), account, subCategory);
        await connection.getRepository(Income).save(income);
        await reloadAccount('cash');

        let expense = new Expense(50, dayjs(), account, subCategory, place);
        await repo.save(expense);

        expense = (await repo.findOne(expense.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expense.amount = 120;

        expect(repo.save(expense)).rejects.toBeTruthy();
      });

      it('should update an expense if cash and balance < change amount', async () => {
        await createAccount('cash');
        await reloadAccount('cash');

        const income = new Income(100, dayjs(), account, subCategory);
        await connection.getRepository(Income).save(income);
        await reloadAccount('cash');

        let expense = new Expense(50, dayjs(), account, subCategory, place);
        await repo.save(expense);

        expense = (await repo.findOne(expense.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expense.amount = 100;

        expect(repo.save(expense)).resolves.toBeTruthy();
      });
    });

    describe('delete', () => {
      beforeEach(async () => {
        await createAccount('credit');
        await reloadAccount('credit');
      });

      it('should not delete an expense if credit and |balance| < amount', async () => {
        let expense = new Expense(200, dayjs(), account, subCategory, place);
        await repo.save(expense);
        await reloadAccount('credit');

        const income = new Income(100, dayjs(), account, subCategory);
        await connection.getRepository(Income).save(income);

        expense = (await repo.findOne(expense.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expect(repo.remove(expense)).rejects.toBeTruthy();
      });

      it('should delete an expense if credit and |balance| = amount', async () => {
        let expense = new Expense(100, dayjs(), account, subCategory, place);
        await repo.save(expense);

        expense = (await repo.findOne(expense.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expect(repo.remove(expense)).resolves.toBeTruthy();
      });

      it('should delete an expense if credit and |balance| > amount', async () => {
        await repo.save(new Expense(200, dayjs(), account, subCategory, place));
        let expense = new Expense(200, dayjs(), account, subCategory, place);
        await repo.save(expense);

        expense = (await repo.findOne(expense.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expect(repo.remove(expense)).rejects.toBeTruthy();
      });
    });
  });
});
