/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import mapValues from 'lodash/mapValues';

/* TODO: check if there is a way to do this properly, the first approach didn't work */
export const filterUnchangedValues = <T extends object>(values: T, initialValues: T): T =>
  mapValues(
    values,
    (value, key) => (value !== initialValues[key as keyof T] ? value : null) as any,
  );

export const initialEmptyNumber = (undefined as unknown) as number;
