const routing = {
  unauthenticated: {
    login: '/login',
    signUp: '/signup',
  },
  authenticated: {
    dashboard: '/',
    movements: '/movements',
    otherMovements: '/debts-and-loans',
    places: '/places',
    people: '/people',
    users: '/users',
  },
} as const;

export default routing;
