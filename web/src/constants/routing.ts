const routing = {
  unauthenticated: {
    login: '/login',
    signUp: '/signup',
  },
  authenticated: {
    dashboard: '/',
    accounts: '/accounts',
    movements: '/movements',
    otherMovements: '/debts-and-loans',
    places: '/places',
    people: '/people',
    users: '/users',
  },
} as const;

export default routing;
