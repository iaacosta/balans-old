/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidatorConstraintInterface,
} from 'class-validator';
import Category from '../models/Category';

const registerValidator = (
  validator: Function | ValidatorConstraintInterface,
) => () => (object: object, propertyName: string): void =>
  registerDecorator({
    target: object.constructor,
    propertyName,
    validator,
  });

export const IsValidBalance = registerValidator({
  validate: (balance: number, { object: account }: any) => {
    if (['cash', 'vista'].includes(account.type)) {
      return balance >= 0;
    }
    return true;
  },
  defaultMessage: () => 'balance should be positive for cash/vista accounts',
});

export const IsValidCategory = registerValidator({
  validate: (category: Category | undefined, { object: transaction }: any) => {
    if (!category) return true;
    const { amount } = transaction;
    if (amount < 0) return category.type === 'expense';
    return category.type === 'income';
  },
  defaultMessage: () => "category selected doesn't match the transaction type",
});
