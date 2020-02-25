/* eslint-disable import/prefer-default-export */
import { getConnection } from 'typeorm';
import { currencies } from './data.json';
import Currency from '../../models/Currency';

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
