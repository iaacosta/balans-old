export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  role: Scalars['String'];
  accounts: Array<Account>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
};


export type Transaction = {
  __typename?: 'Transaction';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  account: Account;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
};

export type Account = {
  __typename?: 'Account';
  id: Scalars['ID'];
  type: AccountType;
  name: Scalars['String'];
  bank: Scalars['String'];
  balance: Scalars['Int'];
  user: User;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
};

export enum AccountType {
  Cash = 'cash',
  Vista = 'vista',
  Checking = 'checking'
}

export type CreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UpdateUserInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  currentPassword: Scalars['String'];
};

export type UpdateAnyUserInput = {
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type CreateAccountInput = {
  type: AccountType;
  name: Scalars['String'];
  bank: Scalars['String'];
  initialBalance: Scalars['Int'];
};

export type CreateTransactionInput = {
  amount: Scalars['Int'];
  accountId: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
};

export type UpdateTransactionInput = {
  id: Scalars['ID'];
  amount?: Maybe<Scalars['Int']>;
  memo?: Maybe<Scalars['String']>;
  accountId?: Maybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  myAccounts: Array<Account>;
  myTransactions: Array<Transaction>;
  users: Array<User>;
  deletedUsers: Array<User>;
  user: User;
  me: User;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
  deleteAccount: Scalars['ID'];
  login: Scalars['String'];
  signUp: Scalars['String'];
  setupDatabase?: Maybe<User>;
  createTransaction: Transaction;
  updateTransaction: Transaction;
  deleteTransaction: Scalars['ID'];
  createUser: User;
  updateUser: User;
  updateMe: User;
  deleteUser: Scalars['ID'];
  restoreUser: User;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationDeleteAccountArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignUpArgs = {
  input: CreateUserInput;
};


export type MutationSetupDatabaseArgs = {
  adminUser: CreateUserInput;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput;
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['ID'];
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateAnyUserInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationRestoreUserArgs = {
  id: Scalars['ID'];
};

export type MyAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAccountsQuery = (
  { __typename?: 'Query' }
  & { accounts: Array<(
    { __typename?: 'Account' }
    & Pick<Account, 'id' | 'name' | 'bank' | 'type' | 'balance'>
  )> }
);

export type CreateDebitAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateDebitAccountMutation = (
  { __typename?: 'Mutation' }
  & { createAccount: (
    { __typename?: 'Account' }
    & Pick<Account, 'id' | 'name' | 'bank' | 'type' | 'balance'>
  ) }
);

export type DeleteDebitAccountMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteDebitAccountMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAccount'>
);

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { token: Mutation['login'] }
);

export type SignUpMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { token: Mutation['signUp'] }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'username' | 'role'>
  ) }
);

export type MyTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyTransactionsQuery = (
  { __typename?: 'Query' }
  & { transactions: Array<(
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id' | 'amount' | 'memo' | 'createdAt'>
    & { account: (
      { __typename?: 'Account' }
      & Pick<Account, 'id' | 'name' | 'bank' | 'balance'>
    ) }
  )> }
);

export type CreateTransactionMutationVariables = Exact<{
  input: CreateTransactionInput;
}>;


export type CreateTransactionMutation = (
  { __typename?: 'Mutation' }
  & { createTransaction: (
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id'>
  ) }
);

export type UpdateTransactionMutationVariables = Exact<{
  input: UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = (
  { __typename?: 'Mutation' }
  & { updateTransaction: (
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id' | 'amount' | 'memo' | 'createdAt'>
    & { account: (
      { __typename?: 'Account' }
      & Pick<Account, 'id' | 'name' | 'bank' | 'balance'>
    ) }
  ) }
);

export type DeleteTransactionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTransactionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTransaction'>
);

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'name' | 'email' | 'username' | 'role'>
  )> }
);

export type AllDeletedUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDeletedUsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email' | 'username' | 'role'>
  )> }
);

export type UpdateUserMutationVariables = Exact<{
  input: UpdateAnyUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'name' | 'email' | 'username' | 'role'>
  ) }
);

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUser'>
);

export type RestoreUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RestoreUserMutation = (
  { __typename?: 'Mutation' }
  & { restoreUser: (
    { __typename?: 'User' }
    & Pick<User, 'id'>
  ) }
);
