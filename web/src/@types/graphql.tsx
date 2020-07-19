import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as React from 'react';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  role: Scalars['String'];
};

export type ByIdInput = {
  id: Scalars['ID'];
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

export type Query = {
  __typename?: 'Query';
  users: Array<User>;
  user: User;
  me: User;
};

export type QueryUserArgs = {
  input: ByIdInput;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: Scalars['String'];
  signUp: Scalars['String'];
  createUser: User;
  updateUser: User;
  updateMe: User;
  deleteUser: Scalars['ID'];
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationSignUpArgs = {
  input: CreateUserInput;
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
  input: ByIdInput;
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = { __typename?: 'Mutation' } & { token: Mutation['login'] };

export type SignUpMutationVariables = Exact<{
  input: CreateUserInput;
}>;

export type SignUpMutation = { __typename?: 'Mutation' } & { token: Mutation['signUp'] };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: 'Query' } & {
  user: { __typename?: 'User' } & Pick<User, 'id' | 'name' | 'username' | 'role'>;
};

export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    token: login(input: { username: $username, password: $password })
  }
`;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;
export type LoginComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<LoginMutation, LoginMutationVariables>,
  'mutation'
>;

export const LoginComponent = (props: LoginComponentProps) => (
  <ApolloReactComponents.Mutation<LoginMutation, LoginMutationVariables>
    mutation={LoginDocument}
    {...props}
  />
);

export type LoginProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;
} &
  TChildProps;
export function withLogin<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    LoginMutation,
    LoginMutationVariables,
    LoginProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    LoginMutation,
    LoginMutationVariables,
    LoginProps<TChildProps, TDataName>
  >(LoginDocument, {
    alias: 'login',
    ...operationOptions,
  });
}
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const SignUpDocument = gql`
  mutation SignUp($input: CreateUserInput!) {
    token: signUp(input: $input)
  }
`;
export type SignUpMutationFn = ApolloReactCommon.MutationFunction<
  SignUpMutation,
  SignUpMutationVariables
>;
export type SignUpComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<SignUpMutation, SignUpMutationVariables>,
  'mutation'
>;

export const SignUpComponent = (props: SignUpComponentProps) => (
  <ApolloReactComponents.Mutation<SignUpMutation, SignUpMutationVariables>
    mutation={SignUpDocument}
    {...props}
  />
);

export type SignUpProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
  [key in TDataName]: ApolloReactCommon.MutationFunction<SignUpMutation, SignUpMutationVariables>;
} &
  TChildProps;
export function withSignUp<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    SignUpMutation,
    SignUpMutationVariables,
    SignUpProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withMutation<
    TProps,
    SignUpMutation,
    SignUpMutationVariables,
    SignUpProps<TChildProps, TDataName>
  >(SignUpDocument, {
    alias: 'signUp',
    ...operationOptions,
  });
}
export type SignUpMutationResult = ApolloReactCommon.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SignUpMutation,
  SignUpMutationVariables
>;
export const MeDocument = gql`
  query Me {
    user: me {
      id
      name
      username
      role
    }
  }
`;
export type MeComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<MeQuery, MeQueryVariables>,
  'query'
>;

export const MeComponent = (props: MeComponentProps) => (
  <ApolloReactComponents.Query<MeQuery, MeQueryVariables> query={MeDocument} {...props} />
);

export type MeProps<TChildProps = {}, TDataName extends string = 'data'> = {
  [key in TDataName]: ApolloReactHoc.DataValue<MeQuery, MeQueryVariables>;
} &
  TChildProps;
export function withMe<TProps, TChildProps = {}, TDataName extends string = 'data'>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    MeQuery,
    MeQueryVariables,
    MeProps<TChildProps, TDataName>
  >,
) {
  return ApolloReactHoc.withQuery<
    TProps,
    MeQuery,
    MeQueryVariables,
    MeProps<TChildProps, TDataName>
  >(MeDocument, {
    alias: 'me',
    ...operationOptions,
  });
}
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
