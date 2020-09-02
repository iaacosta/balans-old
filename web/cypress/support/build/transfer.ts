/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from '@jackfranklin/test-data-bot';

export type BaseTransfer = BuildEntityOmit<GQLCreateTransferInput, 'fromAccountId' | 'toAccountId'>;

export const buildTransfer = (overrides?: Partial<BaseTransfer>) => {
  const builder = build<BaseTransfer>('transfer', {
    fields: {
      amount: fake((faker) => faker.random.number(2000000)),
      memo: fake((faker) => faker.lorem.words(3)),
    },
  });

  return builder({ map: (transfer) => ({ ...transfer, ...overrides }) });
};
