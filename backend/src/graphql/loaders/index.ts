import { AccountsByIdLoader } from './AccountLoaders';
import { CategoriesByIdLoader } from './CategoryLoaders';

export default () =>
  ({
    accounts: { byId: new AccountsByIdLoader() },
    categories: { byId: new CategoriesByIdLoader() },
  } as const);
