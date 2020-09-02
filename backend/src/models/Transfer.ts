/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Entity } from 'typeorm';
import { ObjectType } from 'type-graphql';
import Movement from './Movement';

@Entity()
@ObjectType()
export default class Transfer extends Movement {
  constructor(transfer: {
    amount: number;
    accountId: number;
    memo?: string;
    operationId?: string;
  }) {
    super(transfer);
  }
}
