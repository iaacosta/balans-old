import { ValidationArguments } from 'class-validator';

export const minLengthErrorMessage =
  'must be at least $constraint1 characters long';
export const maxLengthErrorMessage =
  'must be at most $constraint1 characters long';
export const emailErrorMessage = 'must be a valid email';
export const alphanumericErrorMessage = 'must only contain letters and numbers';
export const isInErrorMessage = ({ constraints }: ValidationArguments) =>
  `must be ${constraints[0].map((value: string) => `'${value}'`).join(' or ')}`;
export const isUsernameErrorMessage =
  "must only contain letters, numbers, '-' or '_'";
