import { EntityManager } from 'typeorm';
import { CurrentUser } from '../@types';

export default interface IMovementCommand<T, D> {
  user: NonNullable<CurrentUser>;
  manager: EntityManager;
  data: D;
  execute(): Promise<T>;
}
