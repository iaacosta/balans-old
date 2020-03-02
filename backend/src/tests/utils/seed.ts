/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Client } from 'pg';
import {
  currencies,
  accounts,
  categories,
  subCategories,
  places,
  incomes,
  expenses,
} from './data.json';

export const createPgClient = () => {
  const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
  return new Client({
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
  });
};

export const seedTestDatabase = async (_client: Client) => {
  const queries = [
    ...currencyQueries(),
    ...accountQueries(),
    ...categoryQueries(),
    ...subCategoryQueries(),
    ...placeQueries(),
    ...incomeQueries(),
    ...expenseQueries(),
  ];

  for (const query of queries) {
    await _client.query(query);
  }
};

const currencyQueries = () => [
  'ALTER SEQUENCE currency_id_seq RESTART;',
  'DELETE FROM currency;',
  `INSERT INTO currency("name") VALUES ${currencies
    .reduce((accum, { name }) => `${accum}, ('${name}')`, '')
    .slice(2)};`,
];

const accountQueries = () => [
  'ALTER SEQUENCE account_id_seq RESTART;',
  'DELETE FROM account;',
  `INSERT INTO account("type", "name", "bank", "initialBalance", "currencyId", "billingDay", "paymentDay") VALUES ${accounts
    .reduce(
      (
        accum,
        {
          type,
          name,
          bank,
          initialBalance,
          currencyId,
          billingDay,
          paymentDay,
        },
      ) =>
        `${accum}, ('${type}', '${name}', '${bank}', ${initialBalance}, ${currencyId}, ${billingDay}, ${paymentDay})`,
      '',
    )
    .slice(2)};`,
];

const categoryQueries = () => [
  'ALTER SEQUENCE category_id_seq RESTART;',
  'DELETE FROM category;',
  `INSERT INTO category("name", "type", "icon") VALUES ${categories
    .reduce(
      (accum, { name, type, icon }) =>
        `${accum}, ('${name}', '${type}', '${icon}')`,
      '',
    )
    .slice(2)};`,
];

const subCategoryQueries = () => [
  'ALTER SEQUENCE sub_category_id_seq RESTART;',
  'DELETE FROM sub_category;',
  `INSERT INTO sub_category("name", "categoryId") VALUES ${subCategories
    .reduce(
      (accum, { name, categoryId }) => `${accum}, ('${name}', ${categoryId})`,
      '',
    )
    .slice(2)};`,
];

const placeQueries = () => [
  'ALTER SEQUENCE place_id_seq RESTART;',
  'DELETE FROM place;',
  `INSERT INTO place("name", "photoUri", "latitude", "longitude") VALUES ${places
    .reduce(
      (accum, { name, photoUri, latitude, longitude }) =>
        `${accum}, ('${name}', '${photoUri}', ${latitude}, ${longitude})`,
      '',
    )
    .slice(2)};`,
];

const incomeQueries = () => [
  'ALTER SEQUENCE income_id_seq RESTART;',
  'DELETE FROM income;',
  `INSERT INTO income("amount", "date", "description", "accountId", "subCategoryId") VALUES ${incomes
    .reduce(
      (accum, { amount, date, description, accountId, subCategoryId }) =>
        `${accum}, (${amount}, '${date}', '${description}', ${accountId}, ${subCategoryId})`,
      '',
    )
    .slice(2)};`,
];

const expenseQueries = () => [
  'ALTER SEQUENCE expense_id_seq RESTART;',
  'DELETE FROM expense;',
  `INSERT INTO expense("amount", "date", "description", "installments", "accountId", "subCategoryId", "placeId") VALUES ${expenses
    .reduce(
      (
        accum,
        {
          amount,
          date,
          description,
          installments,
          accountId,
          subCategoryId,
          placeId,
        },
      ) =>
        `${accum}, (${amount}, '${date}', '${description}', ${installments}, ${accountId}, ${subCategoryId}, ${placeId})`,
      '',
    )
    .slice(2)};`,
];
