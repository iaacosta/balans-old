/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';
import { FintualGoal } from '../../@types';
import { RegisterFintualAPIInput } from '../../graphql/helpers';
import { Goal } from '../../graphql/objectTypes';

export const fintualGoalBuilder = build<FintualGoal>('FintualGoal', {
  fields: {
    id: fake((faker) => faker.random.number({ precision: 1 }).toString()),
    type: 'goal',
    attributes: {
      name: fake((faker) => faker.commerce.product()),
      nav: fake((faker) => faker.random.number({ precision: 3 })),
      created_at: fake((faker) => faker.name.jobDescriptor()),
      timeframe: fake((faker) => faker.random.number({ precision: 3 })),
      deposited: fake((faker) => faker.random.number({ precision: 3 })),
      profit: fake((faker) => faker.random.number({ precision: 3 })),
      investments: fake((faker) =>
        Array.from(
          { length: faker.random.number({ precision: 1, min: 1, max: 8 }) },
          () => ({
            weight: faker.random.number({ precision: 3 }),
            asset_id: faker.random.number({ precision: 1 }),
          }),
        ),
      ),
      public_link: fake((faker) => faker.name.jobDescriptor()),
      param_id: fake((faker) => faker.random.number({ precision: 1 })),
      goal_type: fake((faker) => faker.commerce.product()),
      regime: fake((faker) => faker.name.jobDescriptor()),
      completed: oneOf(true, false),
      has_any_withdrawals: oneOf(true, false),
    },
  },
});

export const goalBuilder = build<Goal>('Goal', {
  fields: {
    id: fake((faker) => faker.random.number({ precision: 1 }).toString()),
    name: fake((faker) => faker.commerce.product()),
    value: fake((faker) => faker.random.number({ precision: 3 })),
    deposited: fake((faker) => faker.random.number({ precision: 3 })),
    profit: fake((faker) => faker.random.number({ precision: 3 })),
  },
});

export const fintualCredentialsBuilder = build<RegisterFintualAPIInput>(
  'FintualCredentials',
  {
    fields: {
      email: fake((faker) => faker.internet.email().toLowerCase()),
      token: fake((faker) => faker.random.uuid()),
    },
  },
);
