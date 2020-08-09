import { registerEnumType } from 'type-graphql';

export enum AccountType {
  CASH = 'cash',
  VISTA = 'vista',
  CHECKING = 'checking',
}

registerEnumType(AccountType, { name: 'AccountType' });
