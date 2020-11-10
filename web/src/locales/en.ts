export const en = {
  auth: {
    common: {
      login: 'Log in',
      signup: 'Sign up',
      username: 'Username',
      password: 'Password',
    },
    loginPage: {
      title: 'Welcome back!',
      subtitle: 'Please log in with your account',
      rememberMe: 'Remember me?',
    },
    signUpPage: {
      title: 'First time around?',
      subtitle: 'Fill up your data and become part of the community!',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      confirmPassword: 'Confirm password',
    },
  },
  navbar: {
    dashboard: 'Dashboard',
    accounts: 'Accounts',
    movements: 'Movements',
    categories: 'Categories',
    places: 'Places',
    people: 'People',
    users: 'Users',
    en: 'English',
    es: 'Spanish',
    exit: 'Exit',
  },
  forms: {
    create: 'Create',
    go: 'Go',
    cancel: 'Cancel',
  },
  accounts: {
    title: 'My accounts',
    noDebitAccounts: 'You have no debit accounts yet. Go ahead and create one!',
    tabs: {
      debit: 'Debit accounts',
      credit: 'Credit accounts',
    },
    checking: 'Checking',
    vista: 'Vista',
    cash: 'Cash',
    create: {
      debit: 'Create new debit account',
      credit: 'Create new credit account',
    },
    form: {
      title: 'Create account',
      name: 'Name',
      type: 'Type',
      initialBalance: 'Initial balance',
      bank: 'Bank',
    },
  },
};

export type LocaleShape = typeof en;
