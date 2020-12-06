import { FintualGoal } from '../../@types';
import { Goal } from '../../graphql/objectTypes';

export class FintualGoalParser {
  static parse(goal: FintualGoal): Goal {
    return {
      id: goal.id,
      name: goal.attributes.name,
      value: goal.attributes.nav,
      deposited: goal.attributes.deposited,
      profit: goal.attributes.profit,
    };
  }
}
