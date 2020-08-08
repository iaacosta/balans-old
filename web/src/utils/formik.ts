import mapValues from 'lodash/mapValues';

export const filterUnchangedValues = <TValues extends Record<string, unknown>>(
  values: TValues,
  initialValues: TValues,
): { [key in keyof TValues]: TValues[keyof TValues] | null } =>
  mapValues(values, (value, key) => (value !== initialValues[key as keyof TValues] ? value : null));
