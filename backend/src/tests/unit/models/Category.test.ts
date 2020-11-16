/* eslint-disable no-multi-assign */
import { validateOrReject } from 'class-validator';

import { categoryModelFactory } from '../../factory/categoryFactory';
import { CategoryType } from '../../../graphql/helpers';
import colors from '../../../constants/colors';

jest.mock('../../../models/Transfer');
jest.mock('../../../models/Transaction');

describe('Category model test', () => {
  it('should create Category object', () =>
    expect(categoryModelFactory(1).category).not.toBeFalsy());

  it('should create Category that has correct attributes', () => {
    const { category, factoryCategory } = categoryModelFactory(1);
    expect(category.name).toBe(factoryCategory.name);
    expect(category.type).toBe(factoryCategory.type);
    expect(category.color).toBe(factoryCategory.color);
  });

  describe('validation', () => {
    it('should pass validation if everything is correct', async () => {
      await expect(
        validateOrReject(categoryModelFactory(1)),
      ).resolves.toBeUndefined();
    });

    it('should not pass validation if name is empty', async () => {
      const { category } = categoryModelFactory(1, { name: '' });
      await expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should not pass validation color is not in array', async () => {
      const { category } = categoryModelFactory(1, { color: 'noop' });
      await expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should not pass validation type is not one of category types', async () => {
      const { category } = categoryModelFactory(1, { type: 'noop' as any });
      await expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should pass validation if color is in array', async () => {
      const { category } = categoryModelFactory(1, { color: colors[0] });
      await expect(validateOrReject(category)).resolves.toBeUndefined();
    });

    it('should pass validation if type is in category types', async () => {
      const { category } = categoryModelFactory(1, {
        type: CategoryType.expense,
      });
      await expect(validateOrReject(category)).resolves.toBeUndefined();
    });
  });
});
