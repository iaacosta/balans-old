import currencyResolvers from './currency';
import creditAccountResolvers from './creditAccount';
import debitAccountResolvers from './debitAccount';
import categoryResolvers from './category';
import subCategoryResolvers from './subCategory';
import placeResolvers from './place';
import scalars from './scalars';

export default {
  Query: {
    ...currencyResolvers.Query,
    ...creditAccountResolvers.Query,
    ...debitAccountResolvers.Query,
    ...categoryResolvers.Query,
    ...subCategoryResolvers.Query,
    ...placeResolvers.Query,
  },
  Mutation: {
    ...currencyResolvers.Mutation,
    ...creditAccountResolvers.Mutation,
    ...debitAccountResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...subCategoryResolvers.Mutation,
    ...placeResolvers.Mutation,
  },
  ...scalars,
};
