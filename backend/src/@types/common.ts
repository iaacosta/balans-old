import { authenticateUser } from '../services/passport';
import initializeLoaders from '../graphql/loaders';

export type Then<T> = T extends PromiseLike<infer U> ? U : T;

export type Context = {
  currentUser: Then<ReturnType<typeof authenticateUser>>;
  loaders: Then<ReturnType<typeof initializeLoaders>>;
};
