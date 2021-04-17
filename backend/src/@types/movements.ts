/* eslint-disable @typescript-eslint/comma-dangle */
import {
  CreateTransactionInput,
  CreateTransferInput,
} from '../graphql/helpers';

export type CreateMovementCommandInput<
  T extends CreateTransactionInput | CreateTransferInput
> = Pick<T, 'memo' | 'amount'> & {
  issuedAt?: T['issuedAt'];
};
