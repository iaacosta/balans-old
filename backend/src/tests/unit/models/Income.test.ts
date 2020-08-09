import { validateOrReject } from 'class-validator';

import Income from '../../../models/Income';
import _Account from '../../../models/_Account';
import _SubCategory from '../../../models/SubCategory';

jest.mock('../../../models/Account.ts', () => jest.fn());
jest.mock('../../../models/SubCategory.ts', () => jest.fn());

const Account = _Account as jest.Mock;
const SubCategory = _SubCategory as jest.Mock;

describe('Income model test', () => {
  it('should create Income object', () =>
    expect(
      new Income(1000, 'date' as any, new Account(), new SubCategory()),
    ).not.toBeFalsy());

  it('should create Income that has correct attributes without description', () =>
    expect(
      new Income(1000, 'date' as any, new Account(), new SubCategory()),
    ).toMatchObject({
      amount: 1000,
      date: 'date',
      description: '',
      account: new Account(),
      subCategory: new SubCategory(),
    }));

  it('should create Income that has correct attributes with description', () =>
    expect(
      new Income(
        1000,
        'date' as any,
        new Account(),
        new SubCategory(),
        'example',
      ),
    ).toMatchObject({
      amount: 1000,
      date: 'date',
      description: 'example',
      account: new Account(),
      subCategory: new SubCategory(),
    }));

  describe('validation', () => {
    it('should pass validation if date is an object', async () => {
      const currency = new Income(
        1000,
        {} as any,
        new Account(),
        new SubCategory(),
      );

      expect(await validateOrReject(currency)).toBeUndefined();
    });

    it('should not pass validation if date is not an object', () => {
      const currency = new Income(
        1000,
        'date' as any,
        new Account(),
        new SubCategory(),
      );

      expect(validateOrReject(currency)).rejects.toBeTruthy();
    });

    it('should pass validation if amount > 0', async () => {
      const currency = new Income(
        1000,
        {} as any,
        new Account(),
        new SubCategory(),
      );

      expect(await validateOrReject(currency)).toBeUndefined();
    });

    it('should not pass validation if amount < 0', () => {
      const currency = new Income(
        -10,
        {} as any,
        new Account(),
        new SubCategory(),
      );

      expect(validateOrReject(currency)).rejects.toBeTruthy();
    });
  });
});
