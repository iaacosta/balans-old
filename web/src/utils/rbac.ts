import { User } from '../@types/graphql';

export const roles = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const actions = {
  routes: {
    dashboard: 'routes:dashboard',
    movements: 'routes:movements',
    otherMovements: 'routes:otherMovements',
    places: 'routes:places',
    people: 'routes:people',
    users: 'routes:users',
  },
  users: {
    getAll: 'users:getAll',
    getOne: 'users:getOne',
    create: 'users:create',
    edit: 'users:edit',
    delete: 'users:delete',
  },
} as const;

export type Action =
  | typeof actions['users'][keyof typeof actions['users']]
  | typeof actions['routes'][keyof typeof actions['routes']];

export const rules = {
  user: new Set<string>([
    actions.routes.dashboard,
    actions.routes.movements,
    actions.routes.otherMovements,
    actions.routes.people,
    actions.routes.places,
  ]),
  admin: new Set<string>([
    actions.routes.dashboard,
    actions.routes.movements,
    actions.routes.otherMovements,
    actions.routes.people,
    actions.routes.places,
    actions.routes.users,
    actions.users.getAll,
    actions.users.getOne,
    actions.users.create,
    actions.users.edit,
    actions.users.delete,
  ]),
};

export const canPerform = (user: Pick<User, 'role'>, action: Action): boolean => {
  if (rules[user.role as keyof typeof rules].has(action)) return true;
  return false;
};
