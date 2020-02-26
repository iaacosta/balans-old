import currencyResolvers from './currency';
import creditAccountResolvers from './creditAccount';
import debitAccountResolvers from './debitAccount';
import scalars from './scalars';

export default {
  Query: {
    ...currencyResolvers.Query,
    ...creditAccountResolvers.Query,
    ...debitAccountResolvers.Query,
  },
  Mutation: {
    ...currencyResolvers.Mutation,
    ...creditAccountResolvers.Mutation,
    ...debitAccountResolvers.Mutation,
  },
  ...scalars,
};
