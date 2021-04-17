import { registerEnumType } from 'type-graphql';

export enum CategoryType {
  income = 'income',
  expense = 'expense',
}

registerEnumType(CategoryType, { name: 'CategoryType' });
