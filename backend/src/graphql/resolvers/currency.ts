import { getRepository } from 'typeorm';
import { IFieldResolver } from 'apollo-server-express';

import Currency from '../../models/Currency';

export default {
  getCurrencies: () => getRepository(Currency).find(),
  getCurrency: (parent, args) =>
    getRepository(Currency).find({ where: { id: args.id } }),
} as { [key: string]: IFieldResolver<void, void, Currency> };
