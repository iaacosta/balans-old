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
} from './data.json';
import Category from '../../models/Category';
import SubCategory from '../../models/SubCategory';
import { getCurrencyById, getCategoryById } from './common';
import Place from '../../models/Place';

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
