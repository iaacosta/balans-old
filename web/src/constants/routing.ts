const routing = {
  unauthenticated: {
    login: '/login',
    signUp: '/signup',
  },
  authenticated: {
    dashboard: '/',
    accounts: '/accounts',
    movements: '/movements',
    places: '/places',
    people: '/people',
    users: '/users',
    categories: '/categories',
    investments: '/investments',
  },
} as const;

export default routing;
