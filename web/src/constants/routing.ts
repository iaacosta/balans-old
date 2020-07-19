const routing = {
  unauthenticated: {
    login: { path: '/login' },
    signUp: { path: '/signup' },
  },
} as const;

export default routing;
