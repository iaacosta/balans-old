import { registerDecorator } from 'class-validator';

export const IsValidBalance = () => (object: object, propertyName: string) =>
  registerDecorator({
    target: object.constructor,
    propertyName,
    validator: {
      validate: (balance: number, { object: account }: any) => {
        if (['cash', 'vista'].includes(account.type)) {
          return balance >= 0;
        }
        return true;
      },
      defaultMessage: () =>
        'balance should be positive for cash/vista accounts',
    },
  });
