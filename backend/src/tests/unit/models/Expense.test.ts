import { validateOrReject } from 'class-validator';

import Expense from '../../../models/Expense';
import _Account from '../../../models/Account';
import _SubCategory from '../../../models/SubCategory';
import _Place from '../../../models/Place';

jest.mock('../../../models/Account.ts', () => jest.fn());
jest.mock('../../../models/SubCategory.ts', () => jest.fn());
jest.mock('../../../models/Place.ts', () => jest.fn());

const Account = _Account as jest.Mock;
const SubCategory = _SubCategory as jest.Mock;
const Place = _Place as jest.Mock;

describe('Expense model test', () => {
  it('should create Expense object', () =>
    expect(
      new Expense(
        1000,
        {} as any,
        new Account(),
        new SubCategory(),
        new Place(),
      ),
    ).not.toBeFalsy());

  it('should create Expense that has correct attributes without description', () =>
    expect(
      new Expense(
        1000,
        'date' as any,
        new Account(),
        new SubCategory(),
        new Place(),
      ),
    ).toMatchObject({
      amount: 1000,
      date: 'date',
      description: '',
      installments: 1,
      account: new Account(),
      subCategory: new SubCategory(),
      place: new Place(),
    }));

  it('should create Expense that has correct attributes with description and installments', () =>
    expect(
      new Expense(
        1000,
        'date' as any,
        new Account(),
        new SubCategory(),
        new Place(),
        'example',
        2,
      ),
    ).toMatchObject({
      amount: 1000,
      date: 'date',
      description: 'example',
      installments: 2,
      account: new Account(),
      subCategory: new SubCategory(),
      place: new Place(),
    }));

  describe('validation', () => {
    it('should pass validation if date is an object', async () => {
      const currency = new Expense(
        1000,
        {} as any,
        new Account(),
        new SubCategory(),
        new Place(),
      );

      expect(await validateOrReject(currency)).toBeUndefined();
    });

    it('should not pass validation if date is not an object', () => {
      const currency = new Expense(
        1000,
        'date' as any,
        new Account(),
        new SubCategory(),
        new Place(),
      );

      expect(validateOrReject(currency)).rejects.toBeTruthy();
    });

    it('should pass validation if amount > 0', async () => {
      const currency = new Expense(
        1000,
        {} as any,
        new Account(),
        new SubCategory(),
        new Place(),
      );

      expect(await validateOrReject(currency)).toBeUndefined();
    });

    it('should not pass validation if amount < 0', () => {
      const currency = new Expense(
        -10,
        {} as any,
        new Account(),
        new SubCategory(),
        new Place(),
      );

      expect(validateOrReject(currency)).rejects.toBeTruthy();
    });

    it('should pass validation if installments = 1', async () => {
      const currency = new Expense(
        1000,
        {} as any,
        new Account(),
        new SubCategory(),
        new Place(),
        'example',
        1,
      );

      expect(await validateOrReject(currency)).toBeUndefined();
    });

    it('should not pass validation if installments < 1', () => {
      const currency = new Expense(
        -10,
        {} as any,
        new Account(),
        new SubCategory(),
        new Place(),
        'example',
        0,
      );

      expect(validateOrReject(currency)).rejects.toBeTruthy();
    });

    it('should pass validation if installments > 1 and account type = credit', async () => {
      const currency = new Expense(
        1000,
        {} as any,
        { type: 'credit' } as any,
        new SubCategory(),
        new Place(),
        'example',
        3,
      );

      expect(await validateOrReject(currency)).toBeUndefined();
    });

    it('should not pass validation if installments > 1 and account type !== credit', () => {
      const currency = new Expense(
        1000,
        {} as any,
        { type: 'checking' } as any,
        new SubCategory(),
        new Place(),
        'example',
        3,
      );

      expect(validateOrReject(currency)).rejects.toBeTruthy();
    });
  });
});
