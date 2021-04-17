import { registerEnumType } from 'type-graphql';

export enum Currency {
  CLP = 'CLP',
  USD = 'USD',
}

registerEnumType(Currency, { name: 'Currency' });
