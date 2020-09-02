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
  },
} as const;

export default routing;
