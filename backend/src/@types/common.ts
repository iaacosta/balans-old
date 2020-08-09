import { Connection } from 'typeorm';
import { authenticateUser } from '../services/passport';

export type Then<T> = T extends PromiseLike<infer U> ? U : T;

export type Context = {
  currentUser: Then<ReturnType<typeof authenticateUser>>;
  connection: Connection;
};
