import { registerDecorator } from 'class-validator';

export const IsValidBalance = () => (
  // eslint-disable-next-line @typescript-eslint/ban-types
  object: object,
  propertyName: string,
): void =>
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
