/* eslint-disable import/prefer-default-export */
import { getConnection } from 'typeorm';
import Currency from '../../models/Currency';
import DebitAccount from '../../models/DebitAccount';
import CreditAccount from '../../models/CreditAccount';
import {
  currencies,
  debitAccounts,
  creditAccounts,
  categories,
} from './data.json';
import Category from '../../models/Category';

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

export const seedCreditAccounts = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE credit_account_id_seq RESTART');

  await queryBuilder
    .delete()
    .from(CreditAccount)
    .execute();

  await queryBuilder
    .insert()
    .into(CreditAccount)
    .values(
      creditAccounts.map(({ currencyId, ...rest }) => ({
        ...rest,
        currency: currencies.find(({ id }) => currencyId === id),
      })),
    )
    .execute();
};

export const seedCategories = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE category_id_seq RESTART');

  await queryBuilder
    .delete()
    .from(Category)
    .execute();

  await queryBuilder
    .insert()
    .into(Category)
    .values(categories as Category[])
    .execute();
};
