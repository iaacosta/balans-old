import currencyResolvers from './currency';
import creditAccountResolvers from './creditAccount';
import debitAccountResolvers from './debitAccount';
import categoryResolvers from './category';
import scalars from './scalars';

export default {
  Query: {
    ...currencyResolvers.Query,
    ...creditAccountResolvers.Query,
    ...debitAccountResolvers.Query,
    ...categoryResolvers.Query,
  },
  Mutation: {
    ...currencyResolvers.Mutation,
    ...creditAccountResolvers.Mutation,
    ...debitAccountResolvers.Mutation,
    ...categoryResolvers.Mutation,
  },
  ...scalars,
};
