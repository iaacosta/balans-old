import { Resolver, Query } from 'type-graphql';
import Account from '../../models/Account';
import ExchangeRateService from '../../services/ExchangeRateService';

@Resolver(Account)
export default class ExchangeRateResolvers {
  @Query(() => Number)
  clpUsdExchangeRate(): Promise<number> {
    return ExchangeRateService.getClpUsdExchangeRate();
  }
}
