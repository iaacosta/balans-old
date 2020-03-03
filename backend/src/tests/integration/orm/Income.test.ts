import { createConnection, Connection, Repository } from 'typeorm';
import dayjs from 'dayjs';

import { seedTestDatabase, createPgClient } from '../../utils';
import { incomes } from '../../utils/data.json';
import Income from '../../../models/Income';
import Account from '../../../models/Account';
import SubCategory from '../../../models/SubCategory';
import Currency from '../../../models/Currency';
import { AccountType } from '../../../@types';
import Expense from '../../../models/Expense';
import Place from '../../../models/Place';

console.log = jest.fn();

describe('Income ORM tests', () => {
  let connection: Connection;
  let account: Account;
  let subCategory: SubCategory;
  let place: Place;
  let repo: Repository<Income>;
  const pgClient = createPgClient();

  beforeAll(async () => {
    connection = await createConnection();
    await pgClient.connect();
  });

  beforeEach(async () => {
    await seedTestDatabase(pgClient);
    account = (await connection.getRepository(Account).findOne(2))!;
    subCategory = (await connection.getRepository(SubCategory).findOne())!;
    place = (await connection.getRepository(Place).findOne())!;
    repo = connection.getRepository(Income);
  });

  afterAll(() => {
    connection.close();
    pgClient.end();
  });

  describe('dates', () => {
    it('should parse date correctly on load', async () => {
      const income = await connection
        .getRepository(Income)
        .findOne(incomes[0].id);

      expect(income).toBeTruthy();
      expect(income!.date).toStrictEqual(dayjs(incomes[0].date));
    });

    it('should serialize date correctly on save', async () => {
      await connection
        .getRepository(Income)
        .save(
          new Income(
            1234,
            dayjs('2020-01-01T00:00:00.000Z'),
            account!,
            subCategory!,
          ),
        );

      const [
        { date },
      ] = await connection.query('SELECT date FROM income WHERE amount = $1;', [
        1234,
      ]);

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
        await createAccount('credit', -100);
        await reloadAccount('credit');
      });

      it('should not create an income if type credit and |balance| < amount', async () => {
        const income = new Income(200, dayjs(), account, subCategory);
        expect(repo.save(income)).rejects.toBeTruthy();
      });

      it('should create an income if type credit and |balance| = amount', async () => {
        const income = new Income(100, dayjs(), account, subCategory);
        expect(repo.save(income)).resolves.toBeTruthy();
      });

      it('should create an income if type credit and |balance| > amount', async () => {
        const income = new Income(50, dayjs(), account, subCategory);
        expect(repo.save(income)).resolves.toBeTruthy();
      });
    });

    describe('update', () => {
      it('should not update an expense if cash and balance < change amount', async () => {
        await createAccount('cash');
        await reloadAccount('cash');

        let income = new Income(200, dayjs(), account, subCategory);
        await repo.save(income);
        await reloadAccount('cash');

        const expense = new Expense(100, dayjs(), account, subCategory, place);
        await connection.getRepository(Expense).save(expense);

        income = (await repo.findOne(income.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        income.amount = 50;

        expect(repo.save(income)).rejects.toBeTruthy();
      });

      it('should update an expense if cash and balance = change amount', async () => {
        await createAccount('cash');
        await reloadAccount('cash');

        let income = new Income(200, dayjs(), account, subCategory);
        await repo.save(income);
        await reloadAccount('cash');

        const expense = new Expense(100, dayjs(), account, subCategory, place);
        await connection.getRepository(Expense).save(expense);

        income = (await repo.findOne(income.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        income.amount = 100;

        expect(repo.save(income)).resolves.toBeTruthy();
      });

      it('should not update an expense if credit and |balance| < change amount', async () => {
        await createAccount('credit');
        await reloadAccount('credit');

        const expense = new Expense(100, dayjs(), account, subCategory, place);
        await connection.getRepository(Expense).save(expense);
        await reloadAccount('credit');

        let income = new Income(50, dayjs(), account, subCategory);
        await repo.save(income);

        income = (await repo.findOne(income.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        income.amount = 120;

        expect(repo.save(income)).rejects.toBeTruthy();
      });

      it('should update an expense if credit and |balance| < change amount', async () => {
        await createAccount('credit');
        await reloadAccount('credit');

        const expense = new Expense(100, dayjs(), account, subCategory, place);
        await connection.getRepository(Expense).save(expense);
        await reloadAccount('credit');

        let income = new Income(50, dayjs(), account, subCategory);
        await repo.save(income);

        income = (await repo.findOne(income.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        income.amount = 100;

        expect(repo.save(income)).resolves.toBeTruthy();
      });
    });

    describe('delete', () => {
      beforeEach(async () => {
        await createAccount('cash');
        await reloadAccount('cash');
      });

      it('should not delete an expense if cash and balance < amount', async () => {
        let income = new Income(200, dayjs(), account, subCategory);
        await repo.save(income);
        await reloadAccount('cash');

        const expense = new Expense(100, dayjs(), account, subCategory, place);
        await connection.getRepository(Expense).save(expense);

        income = (await repo.findOne(income.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expect(repo.remove(income)).rejects.toBeTruthy();
      });

      it('should delete an expense if cash and |balance| = amount', async () => {
        let income = new Income(100, dayjs(), account, subCategory);
        await repo.save(income);

        income = (await repo.findOne(income.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expect(repo.remove(income)).resolves.toBeTruthy();
      });

      it('should delete an expense if cash and |balance| > amount', async () => {
        await repo.save(new Income(200, dayjs(), account, subCategory));
        let income = new Income(200, dayjs(), account, subCategory);
        await repo.save(income);

        income = (await repo.findOne(income.id, {
          relations: ['account', 'account.expenses', 'account.incomes'],
        }))!;

        expect(repo.remove(income)).rejects.toBeTruthy();
      });
    });
  });
});
