import DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { keyBy } from 'lodash';
import Account from '../../models/Account';

export class AccountsByIdLoader extends DataLoader<number, Account | null> {
  constructor() {
    super(async (accountIds) => {
      const accounts = await getRepository(Account)
        .createQueryBuilder('account')
        .select()
        .where('id IN (:...accountIds)', { accountIds })
        .getMany();

      const accountsById = keyBy(accounts, 'id');

      return accountIds.map((id) => accountsById[id] || null);
    });
  }
}
