import { registerEnumType } from 'type-graphql';

export enum AccountType {
  cash = 'cash',
  vista = 'vista',
  checking = 'checking',
}

registerEnumType(AccountType, { name: 'AccountType' });
