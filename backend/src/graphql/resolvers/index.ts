import currencyResolvers from './currency';
import accountResolvers from './account';

export default {
  Query: { ...currencyResolvers.Query, ...accountResolvers.Query },
  Mutation: { ...currencyResolvers.Mutation, ...accountResolvers.Mutation },
};
