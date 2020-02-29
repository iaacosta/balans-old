/* eslint-disable import/prefer-default-export */
import { getConnection } from 'typeorm';
import Currency from '../../models/Currency';
import Account from '../../models/Account';
import {
  currencies,
  accounts,
  categories,
  subCategories,
  places,
  incomes,
  expenses,
} from './data.json';
import Category from '../../models/Category';
import SubCategory from '../../models/SubCategory';
import {
  getCurrencyById,
  getCategoryById,
  getSubCategoryById,
  getAccountById,
  getPlaceById,
} from './common';
import Place from '../../models/Place';
import Income from '../../models/Income';
import Expense from '../../models/Expense';

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

export const seedAccounts = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE account_id_seq RESTART;');

  await queryBuilder
    .delete()
    .from(Account)
    .execute();

  await queryBuilder
    .insert()
    .into(Account)
    .values(
      accounts.map(({ currencyId, ...rest }: any) => ({
        ...rest,
        currency: getCurrencyById(currencyId),
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

export const seedSubCategories = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE sub_category_id_seq RESTART');

  await queryBuilder
    .delete()
    .from(SubCategory)
    .execute();

  await queryBuilder
    .insert()
    .into(SubCategory)
    .values(
      subCategories.map(({ categoryId, ...rest }) => ({
        ...rest,
        category: getCategoryById(categoryId) as Category,
      })),
    )
    .execute();
};

export const seedPlaces = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE place_id_seq RESTART');

  await queryBuilder
    .delete()
    .from(Place)
    .execute();

  await queryBuilder
    .insert()
    .into(Place)
    .values(places)
    .execute();
};

export const seedIncomes = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE income_id_seq RESTART');

  await queryBuilder
    .delete()
    .from(Income)
    .execute();

  await queryBuilder
    .insert()
    .into(Income)
    .values(
      incomes.map(({ subCategoryId, accountId, ...rest }: any) => ({
        ...rest,
        subCategory: getSubCategoryById(subCategoryId),
        account: getAccountById(accountId),
      })),
    )
    .execute();
};

export const seedExpenses = async () => {
  const connection = getConnection();
  const queryBuilder = connection.createQueryBuilder();

  await connection.query('ALTER SEQUENCE expense_id_seq RESTART');

  await queryBuilder
    .delete()
    .from(Expense)
    .execute();

  await queryBuilder
    .insert()
    .into(Expense)
    .values(
      expenses.map(({ subCategoryId, accountId, placeId, ...rest }: any) => ({
        ...rest,
        subCategory: getSubCategoryById(subCategoryId),
        account: getAccountById(accountId),
        place: getPlaceById(placeId),
      })),
    )
    .execute();
};
