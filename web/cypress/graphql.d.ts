type Maybe<T> = T | null;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
};

type GQLCategory = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name: Scalars['String'];
  type: GQLCategoryType;
  color: Scalars['String'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
};

type GQLCategoryType = 
  | 'income'
  | 'expense';


type GQLMovement = {
  __typename?: 'Movement';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  operationId: Scalars['String'];
  account: GQLAccount;
  issuedAt: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
};

type GQLTransaction = {
  __typename?: 'Transaction';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  operationId: Scalars['String'];
  account: GQLAccount;
  issuedAt: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
  category?: Maybe<GQLCategory>;
  deletedAt?: Maybe<Scalars['Timestamp']>;
};

type GQLTransfer = {
  __typename?: 'Transfer';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  operationId: Scalars['String'];
  account: GQLAccount;
  issuedAt: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
};

type GQLPassive = {
  __typename?: 'Passive';
  id: Scalars['ID'];
  amount: Scalars['Int'];
  memo?: Maybe<Scalars['String']>;
  operationId: Scalars['String'];
  account: GQLAccount;
  issuedAt: Scalars['Timestamp'];
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
  liquidated: Scalars['Boolean'];
  liquidatedAccount?: Maybe<GQLAccount>;
};

type GQLAccount = {
  __typename?: 'Account';
  id: Scalars['ID'];
  type: GQLAccountType;
  name: Scalars['String'];
  bank: Scalars['String'];
  currency: GQLCurrency;
  balance: Scalars['Int'];
  unliquidatedBalance: Scalars['Int'];
  user: GQLUser;
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
  deletedAt?: Maybe<Scalars['Timestamp']>;
};

type GQLAccountType = 
  | 'cash'
  | 'vista'
  | 'checking';

type GQLCurrency = 
  | 'CLP'
  | 'USD';

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
  categories: Array<GQLCategory>;
  createdAt: Scalars['Timestamp'];
  updatedAt: Scalars['Timestamp'];
  deletedAt?: Maybe<Scalars['Timestamp']>;
};

type GQLPairedTransfer = {
  __typename?: 'PairedTransfer';
  from: GQLTransfer;
  to: GQLTransfer;
};

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
  currency: GQLCurrency;
  initialBalance: Scalars['Int'];
};

type GQLCreateCategoryInput = {
  name: Scalars['String'];
  color: Scalars['String'];
  type: GQLCategoryType;
};

type GQLUpdateCategoryInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  type?: Maybe<GQLCategoryType>;
};

type GQLCreatePassiveInput = {
  amount: Scalars['Int'];
  accountId: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
  issuedAt: Scalars['Timestamp'];
};

type GQLLiquidatePassiveInput = {
  id: Scalars['ID'];
  liquidatedAccountId: Scalars['ID'];
};

type GQLCreateTransactionInput = {
  amount: Scalars['Int'];
  accountId: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
  categoryId: Scalars['ID'];
  issuedAt: Scalars['Timestamp'];
};

type GQLUpdateTransactionInput = {
  id: Scalars['ID'];
  amount?: Maybe<Scalars['Int']>;
  memo?: Maybe<Scalars['String']>;
  accountId?: Maybe<Scalars['ID']>;
  categoryId?: Maybe<Scalars['ID']>;
  issuedAt?: Maybe<Scalars['Timestamp']>;
};

type GQLCreateTransferInput = {
  amount: Scalars['Int'];
  fromAccountId: Scalars['ID'];
  toAccountId: Scalars['ID'];
  memo?: Maybe<Scalars['String']>;
  issuedAt: Scalars['Timestamp'];
};

type GQLQuery = {
  __typename?: 'Query';
  myAccounts: Array<GQLAccount>;
  myCategories: Array<GQLCategory>;
  myPassives: Array<GQLPassive>;
  myTransactions: Array<GQLTransaction>;
  myTransfers: Array<GQLTransfer>;
  myPairedTransfers: Array<GQLPairedTransfer>;
  users: Array<GQLUser>;
  deletedUsers: Array<GQLUser>;
  user: GQLUser;
  me: GQLUser;
};


type GQLQueryMyCategoriesArgs = {
  type: GQLCategoryType;
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
  createCategory: GQLCategory;
  updateCategory: GQLCategory;
  deleteCategory: Scalars['ID'];
  createPassive: GQLPassive;
  liquidatePassive: GQLPassive;
  deletePassive: Scalars['ID'];
  setupDatabase?: Maybe<GQLUser>;
  createTransaction: GQLTransaction;
  updateTransaction: GQLTransaction;
  deleteTransaction: Scalars['ID'];
  createTransfer: Array<GQLTransfer>;
  deleteTransfer: Scalars['String'];
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


type GQLMutationCreateCategoryArgs = {
  input: GQLCreateCategoryInput;
};


type GQLMutationUpdateCategoryArgs = {
  input: GQLUpdateCategoryInput;
};


type GQLMutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


type GQLMutationCreatePassiveArgs = {
  input: GQLCreatePassiveInput;
};


type GQLMutationLiquidatePassiveArgs = {
  input: GQLLiquidatePassiveInput;
};


type GQLMutationDeletePassiveArgs = {
  id: Scalars['ID'];
};


type GQLMutationSetupDatabaseArgs = {
  adminUser: GQLCreateUserInput;
};


type GQLMutationCreateTransactionArgs = {
  input: GQLCreateTransactionInput;
};


type GQLMutationUpdateTransactionArgs = {
  input: GQLUpdateTransactionInput;
};


type GQLMutationDeleteTransactionArgs = {
  id: Scalars['ID'];
};


type GQLMutationCreateTransferArgs = {
  input: GQLCreateTransferInput;
};


type GQLMutationDeleteTransferArgs = {
  operationId: Scalars['String'];
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
    & Pick<GQLAccount, 'id' | 'name' | 'bank' | 'type' | 'currency' | 'balance'>
  ) }
);

type GQLCreateCategoryMutationVariables = Exact<{
  input: GQLCreateCategoryInput;
}>;


type GQLCreateCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createCategory: (
    { __typename?: 'Category' }
    & Pick<GQLCategory, 'id' | 'name' | 'type' | 'color'>
  ) }
);

type GQLCreatePassiveMutationVariables = Exact<{
  input: GQLCreatePassiveInput;
}>;


type GQLCreatePassiveMutation = (
  { __typename?: 'Mutation' }
  & { createPassive: (
    { __typename?: 'Passive' }
    & Pick<GQLPassive, 'id'>
  ) }
);

type GQLLiquidatePassiveMutationVariables = Exact<{
  input: GQLLiquidatePassiveInput;
}>;


type GQLLiquidatePassiveMutation = (
  { __typename?: 'Mutation' }
  & { liquidatePassive: (
    { __typename?: 'Passive' }
    & Pick<GQLPassive, 'id'>
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

type GQLCreateTransferMutationVariables = Exact<{
  input: GQLCreateTransferInput;
}>;


type GQLCreateTransferMutation = (
  { __typename?: 'Mutation' }
  & { createTransfer: Array<(
    { __typename?: 'Transfer' }
    & Pick<GQLTransfer, 'id' | 'operationId'>
  )> }
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
