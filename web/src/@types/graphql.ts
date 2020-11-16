export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name: Scalars['String'];
  type: CategoryType;
  color: Scalars['String'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
};

export enum CategoryType {
  Income = 'income',
  Expense = 'expense'
}


export type Movement = {
  __typename?: 'Movement';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  operationId: Scalars['String'];
  account: Account;
  issuedAt: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
};

export type Transaction = {
  __typename?: 'Transaction';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  operationId: Scalars['String'];
  account: Account;
  issuedAt: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
  category?: Maybe<Category>;
  deletedAt?: Maybe<Scalars['Timestamp']>;
};

export type Transfer = {
  __typename?: 'Transfer';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  operationId: Scalars['String'];
  account: Account;
  issuedAt: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
};

export type Account = {
  __typename?: 'Account';
  id: Scalars['ID'];
  type: AccountType;
  name: Scalars['String'];
  bank: Scalars['String'];
  balance: Scalars['Int'];
  user: User;
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
  deletedAt?: Maybe<Scalars['Timestamp']>;
};

export enum AccountType {
  Cash = 'cash',
  Vista = 'vista',
  Checking = 'checking'
}

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
  categories: Array<Category>;
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
  deletedAt?: Maybe<Scalars['Timestamp']>;
};

export type PairedTransfer = {
  __typename?: 'PairedTransfer';
  from: Transfer;
  to: Transfer;
};

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

export type CreateCategoryInput = {
  name: Scalars['String'];
  color: Scalars['String'];
  type: CategoryType;
};

export type UpdateCategoryInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  type?: Maybe<CategoryType>;
};

export type CreateTransactionInput = {
  amount: Scalars['Int'];
  accountId: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
  categoryId: Scalars['ID'];
  issuedAt: Scalars['Timestamp'];
};

export type UpdateTransactionInput = {
  id: Scalars['ID'];
  amount?: Maybe<Scalars['Int']>;
  memo?: Maybe<Scalars['String']>;
  accountId?: Maybe<Scalars['ID']>;
  categoryId?: Maybe<Scalars['ID']>;
  issuedAt?: Maybe<Scalars['Timestamp']>;
};

export type CreateTransferInput = {
  amount: Scalars['Int'];
  fromAccountId: Scalars['ID'];
  toAccountId: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
  issuedAt: Scalars['Timestamp'];
};

export type Query = {
  __typename?: 'Query';
  myAccounts: Array<Account>;
  myCategories: Array<Category>;
  myTransactions: Array<Transaction>;
  myTransfers: Array<Transfer>;
  myPairedTransfers: Array<PairedTransfer>;
  users: Array<User>;
  deletedUsers: Array<User>;
  user: User;
  me: User;
};


export type QueryMyCategoriesArgs = {
  type: CategoryType;
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
  createCategory: Category;
  updateCategory: Category;
  deleteCategory: Scalars['ID'];
  setupDatabase?: Maybe<User>;
  createTransaction: Transaction;
  updateTransaction: Transaction;
  deleteTransaction: Scalars['ID'];
  createTransfer: Array<Transfer>;
  deleteTransfer: Scalars['String'];
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


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
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


export type MutationCreateTransferArgs = {
  input: CreateTransferInput;
};


export type MutationDeleteTransferArgs = {
  operationId: Scalars['String'];
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

export type MyCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCategoriesQuery = (
  { __typename?: 'Query' }
  & { income: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name' | 'color' | 'type'>
  )>, expense: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name' | 'color' | 'type'>
  )> }
);

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createCategory: (
    { __typename?: 'Category' }
    & Pick<Category, 'id'>
  ) }
);

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = (
  { __typename?: 'Mutation' }
  & { updateCategory: (
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name' | 'type' | 'color'>
  ) }
);

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCategoryMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteCategory'>
);

export type MyTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyTransactionsQuery = (
  { __typename?: 'Query' }
  & { transactions: Array<(
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id' | 'amount' | 'memo' | 'issuedAt'>
    & { account: (
      { __typename?: 'Account' }
      & Pick<Account, 'id' | 'name' | 'bank' | 'balance'>
    ), category?: Maybe<(
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name' | 'color'>
    )> }
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
    & Pick<Transaction, 'id' | 'amount' | 'memo' | 'issuedAt'>
    & { account: (
      { __typename?: 'Account' }
      & Pick<Account, 'id' | 'name' | 'bank' | 'balance'>
    ), category?: Maybe<(
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name' | 'color'>
    )> }
  ) }
);

export type DeleteTransactionMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteTransactionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTransaction'>
);

export type MyTransfersQueryVariables = Exact<{ [key: string]: never; }>;


export type MyTransfersQuery = (
  { __typename?: 'Query' }
  & { transfers: Array<(
    { __typename?: 'PairedTransfer' }
    & { from: (
      { __typename?: 'Transfer' }
      & Pick<Transfer, 'id' | 'amount' | 'memo' | 'operationId' | 'issuedAt'>
      & { account: (
        { __typename?: 'Account' }
        & Pick<Account, 'id' | 'name'>
      ) }
    ), to: (
      { __typename?: 'Transfer' }
      & Pick<Transfer, 'id' | 'amount' | 'memo' | 'operationId' | 'issuedAt'>
      & { account: (
        { __typename?: 'Account' }
        & Pick<Account, 'id' | 'name'>
      ) }
    ) }
  )> }
);

export type CreateTransferMutationVariables = Exact<{
  input: CreateTransferInput;
}>;


export type CreateTransferMutation = (
  { __typename?: 'Mutation' }
  & { createTransfer: Array<(
    { __typename?: 'Transfer' }
    & Pick<Transfer, 'id'>
  )> }
);

export type DeleteTransferMutationVariables = Exact<{
  operationId: Scalars['String'];
}>;


export type DeleteTransferMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTransfer'>
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
