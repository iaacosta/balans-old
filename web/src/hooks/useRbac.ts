/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

export const useCan = (): ((action: Action) => boolean) => {
  const { user, loading, error } = useMe();
  if (loading || error) return () => false;
  return (action) => canPerform(user!, action);
};
