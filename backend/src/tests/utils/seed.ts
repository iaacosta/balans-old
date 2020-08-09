/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Client } from 'pg';

export const createPgClient = () => {
  const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
  return new Client({
    database: `${DB_NAME}_test`,
    user: DB_USERNAME,
    password: DB_PASSWORD,
  });
};

export const seedTestDatabase = async (_client: Client) => {
  const queries = [...userQueries()];

  for (const query of queries) {
    await _client.query(query);
  }
};

const userQueries = () => [
  'ALTER SEQUENCE user_id_seq RESTART;',
  'DELETE FROM public.user;',
];
