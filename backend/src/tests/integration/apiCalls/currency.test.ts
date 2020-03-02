import { createConnection, Connection, getConnection } from 'typeorm';
import {
  query,
  mutate,
  seedCurrencies,
  currency,
  getAccountsRelatedToCurrency,
  seedAccounts,
} from '../../utils';
import { currencies } from '../../utils/data.json';
import Currency from '../../../models/Currency';

const {
  GET_CURRENCIES,
  GET_CURRENCY,
  GET_CURRENCY_AND_ACCOUNTS,
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

  beforeEach(() => seedCurrencies().then(seedAccounts));

  afterAll(() => connection.close());

  describe('getCurrencies', () => {
    it('should get correct currencies', async () => {
      const { data } = await query({ query: GET_CURRENCIES });

      expect(data!.getCurrencies).toHaveLength(2);
      expect(data!.getCurrencies[0].name).toBe(currencies[0].name);
      expect(data!.getCurrencies[1].name).toBe(currencies[1].name);
    });
  });

  describe('getCurrency', () => {
    it('should get correct currency', async () => {
      const { data } = await query({
        query: GET_CURRENCY,
        variables: { id: 1 },
      });

      expect(data!.getCurrency).toMatchObject({
        id: '1',
        name: currencies[0].name,
      });
    });

    it('should get nested query', async () => {
      const { data } = await query({
        query: GET_CURRENCY_AND_ACCOUNTS,
        variables: { id: 1 },
      });

      expect(data!.getCurrency).toMatchObject({
        id: currencies[0].id.toString(),
        name: currencies[0].name,
        accounts: getAccountsRelatedToCurrency(currencies[0].id),
      });
    });
  });

  describe('createCurrency', () => {
    it('should create a currency', async () => {
      await mutate({
        mutation: CREATE_CURRENCY,
        variables: { name: 'CCR' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('currency')
        .from(Currency, 'currency')
        .where('currency.name = :name', { name: 'CCR' })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('CCR');
    });

    it('should not create a currency', async () => {
      await mutate({
        mutation: CREATE_CURRENCY,
        variables: { name: 'Not valid' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('currency')
        .from(Currency, 'currency')
        .where('currency.name = :name', { name: 'CCR' })
        .getOne();

      expect(result).toBeUndefined();
    });
  });

  describe('updateCurrency', () => {
    it('should update a currency', async () => {
      await mutate({
        mutation: UPDATE_CURRENCY,
        variables: { id: 1, name: 'MCR' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('currency')
        .from(Currency, 'currency')
        .where('currency.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('MCR');
    });

    it('should not update a currency', async () => {
      await mutate({
        mutation: UPDATE_CURRENCY,
        variables: { id: 1, name: 'Not valid' },
      });

      const result = await getConnection()
        .createQueryBuilder()
        .select('currency')
        .from(Currency, 'currency')
        .where('currency.id = :id', { id: 1 })
        .getOne();

      expect(result).not.toBeUndefined();
      expect(result!.name).toBe('CR1');
    });
  });

  describe('deleteCurrency', () => {
    it('should delete a currency ', async () => {
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
});
