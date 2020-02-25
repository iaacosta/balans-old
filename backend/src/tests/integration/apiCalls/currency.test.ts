/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createConnection, Connection, getConnection } from 'typeorm';
import { query, mutate, seedCurrencies, currency } from '../../utils';
import { currencies } from '../../utils/data.json';
import Currency from '../../../models/Currency';

const {
  GET_CURRENCIES,
  GET_CURRENCY,
  CREATE_CURRENCY,
  UPDATE_CURRENCY,
  DELETE_CURRENCY,
} = currency;
console.log = jest.fn();

describe('currency API calls', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(seedCurrencies);
  afterAll(() => connection.close());

  it('should get correct currencies on getCurrencies query', async () => {
    const { data } = await query({ query: GET_CURRENCIES });

    expect(data!.getCurrencies).toHaveLength(2);
    expect(data!.getCurrencies[0].name).toBe(currencies[0].name);
    expect(data!.getCurrencies[1].name).toBe(currencies[1].name);
  });

  it('should get correct currency on getCurrency query', async () => {
    const { data } = await query({ query: GET_CURRENCY, variables: { id: 1 } });
    expect(data!.getCurrency).toMatchObject({
      id: '1',
      name: currencies[0].name,
    });
  });

  it('should create a currency on createCurrency mutation', async () => {
    await mutate({
      mutation: CREATE_CURRENCY,
      variables: { name: 'Created currency' },
    });

    const result = await getConnection()
      .createQueryBuilder()
      .select('currency')
      .from(Currency, 'currency')
      .where('currency.name = :name', { name: 'Created currency' })
      .getOne();

    expect(result).not.toBeUndefined();
    expect(result!.name).toBe('Created currency');
  });

  it('should update a currency on updateCurrency mutation', async () => {
    await mutate({
      mutation: UPDATE_CURRENCY,
      variables: { id: 1, name: 'Modified currency' },
    });

    const result = await getConnection()
      .createQueryBuilder()
      .select('currency')
      .from(Currency, 'currency')
      .where('currency.id = :id', { id: 1 })
      .getOne();

    expect(result).not.toBeUndefined();
    expect(result!.name).toBe('Modified currency');
  });

  it('should delete a currency on deleteCurrency mutation', async () => {
    await mutate({
      mutation: DELETE_CURRENCY,
      variables: { id: 1 },
    });

    const result = await getConnection()
      .createQueryBuilder()
      .select('currency')
      .from(Currency, 'currency')
      .where('currency.id = :id', { id: 1 })
      .getOne();

    expect(result).toBeUndefined();
  });
});
