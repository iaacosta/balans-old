type Maybe<T> = T | null;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

type GQLUser = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  role: Scalars['String'];
  accounts: Array<GQLAccount>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
};


type GQLTransaction = {
  __typename?: 'Transaction';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  resultantBalance: Scalars['Int'];
  account: GQLAccount;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
};

type GQLAccount = {
  __typename?: 'Account';
  id: Scalars['ID'];
  type: GQLAccountType;
  name: Scalars['String'];
  bank: Scalars['String'];
  balance: Scalars['Int'];
  user: GQLUser;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
};

type GQLAccountType = 
  | 'cash'
  | 'vista'
  | 'checking';

type GQLCreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

type GQLUpdateUserInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  currentPassword: Scalars['String'];
};

type GQLUpdateAnyUserInput = {
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

type GQLLoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

type GQLCreateAccountInput = {
  type: GQLAccountType;
  name: Scalars['String'];
  bank: Scalars['String'];
  initialBalance: Scalars['Int'];
};

type GQLCreateTransactionInput = {
  amount: Scalars['Int'];
  accountId: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
};

type GQLQuery = {
  __typename?: 'Query';
  myAccounts: Array<GQLAccount>;
  myTransactions: Array<GQLTransaction>;
  users: Array<GQLUser>;
  deletedUsers: Array<GQLUser>;
  user: GQLUser;
  me: GQLUser;
};


type GQLQueryUserArgs = {
  id: Scalars['ID'];
};

type GQLMutation = {
  __typename?: 'Mutation';
  createAccount: GQLAccount;
  deleteAccount: Scalars['ID'];
  login: Scalars['String'];
  signUp: Scalars['String'];
  setupDatabase?: Maybe<GQLUser>;
  createTransaction: GQLTransaction;
  deleteTransaction: Scalars['ID'];
  createUser: GQLUser;
  updateUser: GQLUser;
  updateMe: GQLUser;
  deleteUser: Scalars['ID'];
  restoreUser: GQLUser;
};


type GQLMutationCreateAccountArgs = {
  input: GQLCreateAccountInput;
};


type GQLMutationDeleteAccountArgs = {
  id: Scalars['ID'];
};


type GQLMutationLoginArgs = {
  input: GQLLoginInput;
};


type GQLMutationSignUpArgs = {
  input: GQLCreateUserInput;
};


type GQLMutationSetupDatabaseArgs = {
  adminUser: GQLCreateUserInput;
};


type GQLMutationCreateTransactionArgs = {
  input: GQLCreateTransactionInput;
};


type GQLMutationDeleteTransactionArgs = {
  id: Scalars['ID'];
};


type GQLMutationCreateUserArgs = {
  input: GQLCreateUserInput;
};


type GQLMutationUpdateUserArgs = {
  input: GQLUpdateAnyUserInput;
};


type GQLMutationUpdateMeArgs = {
  input: GQLUpdateUserInput;
};


type GQLMutationDeleteUserArgs = {
  id: Scalars['ID'];
};


type GQLMutationRestoreUserArgs = {
  id: Scalars['ID'];
};

type GQLCreateDebitAccountMutationVariables = Exact<{
  input: GQLCreateAccountInput;
}>;


type GQLCreateDebitAccountMutation = (
  { __typename?: 'Mutation' }
  & { createAccount: (
    { __typename?: 'Account' }
    & Pick<GQLAccount, 'id' | 'name' | 'bank' | 'type' | 'balance'>
  ) }
);

type GQLSetupDatabaseMutationVariables = Exact<{
  user: GQLCreateUserInput;
}>;


type GQLSetupDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { setupDatabase?: Maybe<(
    { __typename?: 'User' }
    & Pick<GQLUser, 'id'>
  )> }
);

type GQLCreateTransactionMutationVariables = Exact<{
  input: GQLCreateTransactionInput;
}>;


type GQLCreateTransactionMutation = (
  { __typename?: 'Mutation' }
  & { createTransaction: (
    { __typename?: 'Transaction' }
    & Pick<GQLTransaction, 'id'>
  ) }
);

type GQLMeQueryVariables = Exact<{ [key: string]: never; }>;


type GQLMeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<GQLUser, 'id' | 'name' | 'username' | 'email' | 'role'>
  ) }
);

type GQLLoginMutationVariables = Exact<{
  input: GQLLoginInput;
}>;


type GQLLoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<GQLMutation, 'login'>
);

type GQLCreateUserMutationVariables = Exact<{
  input: GQLCreateUserInput;
}>;


type GQLCreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<GQLUser, 'id'>
  ) }
);

type GQLDeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


type GQLDeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<GQLMutation, 'deleteUser'>
);
