/* eslint-disable prefer-promise-reject-errors */
import { FintualGoalParser } from '../../../utils/parsers';
import { fintualGoalBuilder } from '../../factory/fintualFactory';

describe('FintualGoalParser tests', () => {
  it('should parse api response correctly', () => {
    const apiGoal = fintualGoalBuilder();

    expect(FintualGoalParser.parse(apiGoal)).toMatchObject({
      id: apiGoal.id,
      name: apiGoal.attributes.name,
      deposited: apiGoal.attributes.deposited,
      profit: apiGoal.attributes.profit,
      value: apiGoal.attributes.nav,
    });
  });
});
