const routing = {
  unauthenticated: {
    login: { path: '/login' },
    signUp: { path: '/signup' },
  },
  authenticated: {
    dashboard: { path: '/' },
  },
} as const;

export default routing;
