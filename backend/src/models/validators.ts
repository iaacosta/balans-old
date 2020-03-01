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

export const IsValidMovement = (type: 'positive' | 'negative') => (
  object: object,
  propertyName: string,
) =>
  registerDecorator({
    target: object.constructor,
    propertyName,
    validator: {
      validate: (amount: number, { object: movement }: any) => {
        const { account } = movement;

        if (type === 'negative') {
          if (
            ['cash', 'vista'].includes(account.type) &&
            account.balance - amount < 0
          ) {
            return false;
          }
        } else {
          if (account.type === 'credit' && account.balance + amount > 0) {
            return false;
          }
        }

        return true;
      },
      defaultMessage: () =>
        'invalid amount, either it surpass 0 on credit account or goes below 0 on cash/vista account',
    },
  });
