import { Connection } from 'typeorm';

import S3Helper from '../utils/S3Helper';
import { authenticateUser } from '../services/passport';

export type CategoryType = 'income' | 'expense';
export type AccountType = 'cash' | 'vista' | 'checking' | 'credit';
export type Then<T> = T extends PromiseLike<infer U> ? U : T;

export type Context = {
  s3: S3Helper;
  currentUser: Then<ReturnType<typeof authenticateUser>>;
  connection: Connection;
};
