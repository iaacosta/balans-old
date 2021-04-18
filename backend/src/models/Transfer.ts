import { Column, Entity } from 'typeorm';
import { ObjectType } from 'type-graphql';
import Movement from './Movement';

@Entity()
@ObjectType()
export default class Transfer extends Movement {
  @Column({ type: 'float' })
  operationExchangeRate: number;

  constructor(transfer: {
    amount: number;
    accountId: number;
    issuedAt?: Date;
    memo?: string;
    operationId?: string;
    operationExchangeRate?: number;
  }) {
    super(transfer);
    if (transfer) {
      this.operationExchangeRate = transfer.operationExchangeRate || 1;
    }
  }
}
