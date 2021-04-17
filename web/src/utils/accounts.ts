import { AccountType } from '../@types/graphql';
import { LocaleKeys } from '../@types/locales';

export const localeKeyFromAccountType = (type: AccountType): LocaleKeys => {
  switch (type) {
    case AccountType.Cash:
      return 'accounts:cash';
    case AccountType.Vista:
      return 'accounts:vista';
    case AccountType.Checking:
      return 'accounts:checking';
    default:
      return 'accounts:cash';
  }
};
