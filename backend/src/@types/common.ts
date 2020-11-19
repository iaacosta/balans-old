import { authenticateUser } from '../services/passport';
import initializeLoaders from '../graphql/loaders';

export type Then<T> = T extends PromiseLike<infer U> ? U : T;

export type CurrentUser = Then<ReturnType<typeof authenticateUser>>;

export type Context = {
  currentUser: CurrentUser;
  loaders: Then<ReturnType<typeof initializeLoaders>>;
};
