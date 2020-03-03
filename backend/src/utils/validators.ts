import { registerDecorator } from 'class-validator';

export const IsInstallments = () => (object: object, propertyName: string) =>
  registerDecorator({
    target: object.constructor,
    propertyName,
    validator: {
      validate: (installments: number, { object: expense }: any) => {
        if (installments < 1) return false;
        if (expense.account.type !== 'credit' && installments > 1) return false;
        return true;
      },
      defaultMessage: () =>
        'installments should always be greater than 1 and exactly 1 if non-credit account given',
    },
  });

export const IsValidInitialBalance = () => (
  object: object,
  propertyName: string,
) =>
  registerDecorator({
    target: object.constructor,
    propertyName,
    validator: {
      validate: (initialBalance: number, { object: account }: any) => {
        if (['cash', 'vista'].includes(account.type)) {
          return initialBalance >= 0;
        }

        if (account.type === 'credit') {
          return initialBalance <= 0;
        }

        return true;
      },
      defaultMessage: () =>
        'invalid initial balance. it should be > 0 for cash/vista accounts and < 0 for credit accounts',
    },
  });
