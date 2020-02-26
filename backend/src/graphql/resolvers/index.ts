import currencyResolvers from './currency';
import creditAccountResolvers from './creditAccount';
import debitAccountResolvers from './debitAccount';

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
};
