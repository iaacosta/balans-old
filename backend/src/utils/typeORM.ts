/* eslint-disable no-param-reassign */
import { forEach } from 'lodash';

export const updateEntity = <T extends { id: number }>(
  entity: T,
  toChange: Partial<T>,
): void => {
  forEach<Partial<T>>(toChange, (value, key) => {
    /* istanbul ignore next */
    if (value) (entity as any)[key] = value;
  });
};
