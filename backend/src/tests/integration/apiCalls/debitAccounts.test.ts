/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createConnection, Connection, getConnection } from 'typeorm';
import {
  query,
  mutate,
  seedCurrencies,
  seedDebitAccounts,
  debitAccount,
  getCurrencyById,
} from '../../utils';
import { debitAccounts } from '../../utils/data.json';
import DebitAccount from '../../../models/DebitAccount';

const {
  GET_DEBIT_ACCOUNTS,
  GET_DEBIT_ACCOUNT,
  CREATE_DEBIT_ACCOUNT,
  UPDATE_DEBIT_ACCOUNT,
  DELETE_DEBIT_ACCOUNT,
} = debitAccount;
console.log = jest.fn();

describe('currency API calls', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(() => seedCurrencies().then(seedDebitAccounts));
  afterAll(() => connection.close());

  it('should get correct debit accounts on getDebitAccounts query', async () => {
    const { data } = await query({ query: GET_DEBIT_ACCOUNTS });
    expect(data!.getDebitAccounts).toHaveLength(2);

    debitAccounts.forEach((acc, idx) => {
      expect(data!.getDebitAccounts[idx]).toMatchObject({
        name: acc.name,
        bank: acc.bank,
        initialBalance: acc.initialBalance,
        allowsNegative: acc.allowsNegative,
        currency: {
          ...getCurrencyById(acc.currencyId)!,
          id: acc.currencyId.toString(),
        },
      });
    });
  });

  it('should get correct debit account on getDebitAccount query', async () => {
    const { data } = await query({
      query: GET_DEBIT_ACCOUNT,
      variables: { id: 1 },
    });

    expect(data!.getDebitAccount).toMatchObject({
      id: '1',
      name: debitAccounts[0].name,
      bank: debitAccounts[0].bank,
      initialBalance: debitAccounts[0].initialBalance,
      allowsNegative: debitAccounts[0].allowsNegative,
    });
  });

  it('should create a debit account on createDebitAccount mutation', async () => {
    const exampleAccount = {
      name: 'Created debit account',
      bank: 'Bank',
      initialBalance: 0,
      allowsNegative: false,
      currencyId: 1,
    };

    await mutate({ mutation: CREATE_DEBIT_ACCOUNT, variables: exampleAccount });

    const result = await getConnection()
      .getRepository(DebitAccount)
      .createQueryBuilder('debit_account')
      .leftJoinAndSelect('debit_account.currency', 'currency')
      .where('debit_account.name = :name', { name: 'Created debit account' })
      .getOne();

    expect(result).not.toBeUndefined();
    expect(result).toMatchObject({
      name: exampleAccount.name,
      bank: exampleAccount.bank,
      initialBalance: exampleAccount.initialBalance,
      allowsNegative: exampleAccount.allowsNegative,
      currency: getCurrencyById(exampleAccount.currencyId),
    });
  });

  it('should update an account on updateDebitAccount mutation', async () => {
    await mutate({
      mutation: UPDATE_DEBIT_ACCOUNT,
      variables: { id: 1, name: 'Modified debit account', currencyId: 2 },
    });

    const result = await getConnection()
      .getRepository(DebitAccount)
      .createQueryBuilder('debit_account')
      .leftJoinAndSelect('debit_account.currency', 'currency')
      .where('debit_account.id = :id', { id: 1 })
      .getOne();

    expect(result).not.toBeUndefined();
    expect(result!.name).toBe('Modified debit account');
    expect(result!.currency).toMatchObject(getCurrencyById(2)!);
  });

  it('should delete a currency on deleteCurrency mutation', async () => {
    await mutate({
      mutation: DELETE_DEBIT_ACCOUNT,
      variables: { id: 1 },
    });

    const result = await getConnection()
      .createQueryBuilder()
      .select('debit_account')
      .from(DebitAccount, 'debit_account')
      .where('debit_account.id = :id', { id: 1 })
      .getOne();

    expect(result).toBeUndefined();
  });
});
