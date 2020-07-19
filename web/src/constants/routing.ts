const routing = {
  unauthenticated: {
    login: { path: '/login' },
    signUp: { path: '/signup' },
  },
  authenticated: {
    dashboard: { path: '/' },
    movements: { path: '/movements' },
    otherMovements: { path: '/debts-and-loans' },
    places: { path: '/places' },
    people: { path: '/people' },
  },
} as const;

export default routing;
