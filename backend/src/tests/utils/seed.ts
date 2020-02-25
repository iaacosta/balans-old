/* eslint-disable import/prefer-default-export */
import { getConnection } from 'typeorm';
import { currencies, debitAccounts } from './data.json';
import Currency from '../../models/Currency';
import DebitAccount from '../../models/DebitAccount';

export const seedCurrencies = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE currency_id_seq RESTART');

  await queryBuilder
    .delete()
    .from(Currency)
    .execute();

  await queryBuilder
    .insert()
    .into(Currency)
    .values(currencies)
    .execute();
};

export const seedDebitAccounts = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE debit_account_id_seq RESTART');

  await queryBuilder
    .delete()
    .from(DebitAccount)
    .execute();

  await queryBuilder
    .insert()
    .into(DebitAccount)
    .values(
      debitAccounts.map(({ currencyId, ...rest }) => ({
        ...rest,
        currency: currencies.find(({ id }) => currencyId === id),
      })),
    )
    .execute();
};
