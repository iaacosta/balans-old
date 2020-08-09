/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ApolloError } from '@apollo/client';
import { Action, canPerform } from '../utils/rbac';
import { useMe } from './useMe';

type Props = {
  action: Action;
};

export const useRbac = ({ action }: Props): boolean => {
  const { user, loading, error } = useMe();
  if (loading || error) return false;
  return canPerform(user!, action);
};

export const useCan = (): {
  canPerform: (action: Action) => boolean;
  loading: boolean;
  error?: ApolloError;
} => {
  const { user, loading, error } = useMe();
  if (loading || error) return { canPerform: () => false, loading, error };
  return { canPerform: (action) => canPerform(user!, action), loading, error };
};
