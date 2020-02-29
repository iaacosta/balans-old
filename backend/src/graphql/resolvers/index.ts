import currencyResolvers from './currency';
import accountResolvers from './account';
import categoryResolvers from './category';
import subCategoryResolvers from './subCategory';
import placeResolvers from './place';
import incomeResolvers from './income';
import scalars from './scalars';

export default {
  Query: {
    ...currencyResolvers.Query,
    ...accountResolvers.Query,
    ...categoryResolvers.Query,
    ...subCategoryResolvers.Query,
    ...placeResolvers.Query,
    ...incomeResolvers.Query,
  },
  Mutation: {
    ...currencyResolvers.Mutation,
    ...accountResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...subCategoryResolvers.Mutation,
    ...placeResolvers.Mutation,
    ...incomeResolvers.Mutation,
  },
  ...scalars,
};
