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
    update: 'Update',
    liquidate: 'Liquidate',
    go: 'Go',
    cancel: 'Cancel',
  },
  validation: {
    mixed: {
      required: 'This field is required',
    },
    string: {
      email: 'Must be an email',
      min: 'Must be at least {{value}} characters long',
    },
    number: {
      min: 'Must be greater than {{value}}',
    },
    date: {
      max: 'Must be earlier than {{value}}',
    },
    custom: {
      notOneOf: 'Must be different from {{value}}',
      invalidOption: 'Opción inválida',
      passwordsDontMatch: "Passwords don't match",
      username: "Should only contain numbers, letters and '-', '_' or '.'",
    },
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
      currency: 'Currency',
    },
  },
  tables: {
    actions: 'Actions',
  },
  movements: {
    title: 'My movements',
    transaction: 'Transaction',
    transfer: 'Transfer',
    atLeastOneAccount: 'You need at least one account to see this',
    atLeastTwoAccounts: 'You need at least two accounts to see this',
    noneCreated: 'No {{value}} created yet',
    create: {
      transaction: 'Create new transaction',
      transfer: 'Create new transfer',
      passive: 'Create new passive',
    },
    tabs: {
      transactions: 'Transactions',
      transfers: 'Transfers',
      passives: 'Passive',
    },
    form: {
      amount: 'Amount',
      transactionType: 'Transaction type',
      passiveType: 'Passive type',
      category: 'Category',
      memo: 'Memo',
      account: 'Account',
      fromAccount: 'Origin account',
      toAccount: 'Destination account',
      issuedAt: 'Issued at',
    },
  },
  categories: {
    title: 'My categories',
    create: 'Create new category',
    expense: 'Expense',
    income: 'Income',
    form: {
      name: 'Name',
      type: 'Type',
      color: 'Color',
    },
  },
  users: {
    title: 'Platform users',
    tabs: {
      active: 'Active users',
      deleted: 'Deleted users',
    },
    form: {
      name: 'Name',
      role: 'Role',
    },
  },
  elements: {
    singular: {
      account: 'Account',
      liquidatedAccount: 'Liquidated account',
      category: 'Category',
      passive: 'Passive',
      debt: 'Debt',
      loan: 'Loan',
      transaction: 'Transaction',
      transfer: 'Transfer',
      user: 'User',
    },
    plural: {
      account: 'Accounts',
      liquidatedAccount: 'Liquidated accounts',
      category: 'Categories',
      passive: 'Passives',
      debt: 'Debts',
      loan: 'Loans',
      transaction: 'Transactions',
      transfer: 'Transfers',
      user: 'Users',
    },
  },
  snackbars: {
    success: {
      created: '{{value}} created successfully',
      updated: '{{value}} updated successfully',
      deleted: '{{value}} deleted successfully',
      restored: '{{value}} restored successfully',
      liquidated: '{{value}} liquidated successfully',
      done: 'Action done successfully',
    },
    error: {
      unknown: 'An unknown error has occurred',
    },
  },
  others: {
    passiveStatus: 'Status',
    passivePaid: 'Paid',
    passivePending: 'Pending',
    liquidated: 'Liquidated',
    unliquidated: 'Unliquidated',
  },
};

export type LocaleShape = typeof en;
