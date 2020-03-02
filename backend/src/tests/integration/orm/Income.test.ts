import { createConnection, Connection } from 'typeorm';
import dayjs from 'dayjs';

import { seedTestDatabase, createPgClient } from '../../utils';
import { incomes } from '../../utils/data.json';
import Income from '../../../models/Income';
import Account from '../../../models/Account';
import SubCategory from '../../../models/SubCategory';

console.log = jest.fn();

describe('Income ORM tests', () => {
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

  it('should parse date correctly on load', async () => {
    const income = await connection
      .getRepository(Income)
      .findOne(incomes[0].id);

    expect(income).toBeTruthy();
    expect(income!.date).toStrictEqual(dayjs(incomes[0].date));
  });

  it('should serialize date correctly on save', async () => {
    const account = await connection.getRepository(Account).findOne();
    const subCategory = await connection.getRepository(SubCategory).findOne();

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
