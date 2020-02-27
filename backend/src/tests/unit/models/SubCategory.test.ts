import { validateOrReject } from 'class-validator';

import SubCategory from '../../../models/SubCategory';
import _Category from '../../../models/Category';

jest.mock('../../../models/Category.ts', () => jest.fn());
const Category = _Category as jest.Mock;

describe('SubCategory model test', () => {
  it('should create SubCategory object', () =>
    expect(new SubCategory('SubCategory', new Category())).not.toBeFalsy());

  it('should create SubCategory that has correct attributes', () =>
    expect(new SubCategory('SubCategory', new Category())).toMatchObject({
      name: 'SubCategory',
      category: new Category(),
    }));

  describe('validation', () => {
    it('should not pass validation if name is empty', () => {
      const category = new SubCategory('', new Category());
      expect(validateOrReject(category)).rejects.toBeTruthy();
    });
  });
});
