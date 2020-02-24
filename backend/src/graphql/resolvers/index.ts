import currencyResolvers from './currency';

export default {
  Query: { ...currencyResolvers.Query },
  Mutation: { ...currencyResolvers.Mutation },
};
