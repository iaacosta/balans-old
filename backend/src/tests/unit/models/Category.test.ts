import { validateOrReject } from 'class-validator';

import Category from '../../../models/Category';

describe('Category model test', () => {
  it('should create Category object', () =>
    expect(new Category('Category', 'income', 'ex')).not.toBeFalsy());

  it('should create Category that has correct attributes', () => {
    expect(new Category('Category', 'income', 'ex')).toMatchObject({
      name: 'Category',
      type: 'income',
      icon: 'ex',
    });
  });

  describe('validation', () => {
    it('should not pass validation if type is different from income/expense', () => {
      const category = new Category('Category', 'hello' as any, 'ex');
      expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should not pass validation if name is empty', () => {
      const category = new Category('', 'income', 'ex');
      expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should not pass validation if icon is empty', () => {
      const category = new Category('Category', 'income', '');
      expect(validateOrReject(category)).rejects.toBeTruthy();
    });

    it('should pass validation if type is income', async () => {
      const category = new Category('Category', 'income', 'ex');
      expect(await validateOrReject(category)).toBeUndefined();
    });

    it('should pass validation if type is expense', async () => {
      const category = new Category('Category', 'expense', 'ex');
      expect(await validateOrReject(category)).toBeUndefined();
    });
  });
});
