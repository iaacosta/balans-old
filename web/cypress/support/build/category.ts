/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { build, fake, oneOf } from '@jackfranklin/test-data-bot';

export type BaseCategory = GQLCreateCategoryInput;

export const buildCategory = (overrides?: Partial<BaseCategory>) => {
  const builder = build<BaseCategory>('account', {
    fields: {
      name: fake((faker) => faker.commerce.product()),
      type: oneOf<GQLCategoryType>('income', 'expense'),
      color: oneOf(
        '#e9d45d',
        '#d5715d',
        '#c5283d',
        '#c85695',
        '#a45fbf',
        '#3688bf',
        '#8be4db',
        '#1652df',
        '#06b178',
        '#a5cc6b',
        '#8091a6',
        '#536e91',
        '#1c232b',
      ),
    },
  });

  return builder({ map: (category) => ({ ...category, ...overrides }) });
};
