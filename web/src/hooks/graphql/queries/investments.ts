import { gql } from '@apollo/client';

export const myFintualGoalsQuery = gql`
  query MyFintualGoals {
    goals: myFintualGoals {
      id
      name
      value
      deposited
      profit
    }
  }
`;

export const registerFintualCredentialsMutation = gql`
  mutation RegisterFintualCredentials($input: RegisterFintualAPIInput!) {
    registerFintualCredentials(input: $input)
  }
`;
