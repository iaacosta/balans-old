type Maybe<T> = T | null;
type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  role: Scalars['String'];
};

type CreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

type UpdateUserInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  currentPassword: Scalars['String'];
};

type UpdateAnyUserInput = {
  id: Scalars['ID'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

type Query = {
  __typename?: 'Query';
  users: Array<User>;
  deletedUsers: Array<User>;
  user: User;
  me: User;
};


type QueryUserArgs = {
  id: Scalars['ID'];
};

type Mutation = {
  __typename?: 'Mutation';
  login: Scalars['String'];
  signUp: Scalars['String'];
  setupDatabase?: Maybe<User>;
  createUser: User;
  updateUser: User;
  updateMe: User;
  deleteUser: Scalars['ID'];
  restoreUser: User;
};


type MutationLoginArgs = {
  input: LoginInput;
};


type MutationSignUpArgs = {
  input: CreateUserInput;
};


type MutationSetupDatabaseArgs = {
  adminUser: CreateUserInput;
};


type MutationCreateUserArgs = {
  input: CreateUserInput;
};


type MutationUpdateUserArgs = {
  input: UpdateAnyUserInput;
};


type MutationUpdateMeArgs = {
  input: UpdateUserInput;
};


type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


type MutationRestoreUserArgs = {
  id: Scalars['ID'];
};

type SetupDatabaseMutationVariables = Exact<{
  user: CreateUserInput;
}>;


type SetupDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { setupDatabase?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

type MeQueryVariables = Exact<{ [key: string]: never; }>;


type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'username' | 'email' | 'role'>
  ) }
);

type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<User, 'id'>
  ) }
);

type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUser'>
);
