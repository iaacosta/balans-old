/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { Client } from 'pg';

export const createPgClient = (): Client => {
  const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
  return new Client({
    database: `${DB_NAME}_test`,
    user: DB_USERNAME,
    password: DB_PASSWORD,
  });
};

export const seedTestDatabase = async (_client: Client): Promise<void> => {
  const queries = [
    'ALTER SEQUENCE user_id_seq RESTART;',
    'DELETE FROM "user" CASCADE;',
    'ALTER SEQUENCE account_id_seq RESTART;',
    'DELETE FROM "account";',
    'ALTER SEQUENCE transaction_id_seq RESTART;',
    'DELETE FROM "transaction";',
    'ALTER SEQUENCE transfer_id_seq RESTART;',
    'DELETE FROM "transfer";',
    'ALTER SEQUENCE passive_id_seq RESTART;',
    'DELETE FROM "passive";',
    'ALTER SEQUENCE category_id_seq RESTART;',
    'DELETE FROM "category";',
  ];

  for (const query of queries) {
    await _client.query(query);
  }
};
