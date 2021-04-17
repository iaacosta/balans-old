import React, { useMemo, useContext } from 'react';

import { MyTransactionsQuery } from '../../@types/graphql';
import { useMyDebitAccounts, useUpdateTransaction, useMyCategories } from '../../hooks/graphql';
import TransactionFormView from './TransactionFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { filterUnchangedValues } from '../../utils/formik';

interface Props {
  transaction: MyTransactionsQuery['transactions'][number];
}

const UpdateTransactionDialog: React.FC<Props> = ({ transaction }) => {
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountLoading } = useMyDebitAccounts();
  const { income, expense, loading: categoriesLoading } = useMyCategories();
  const [updateTransaction, { loading: updateLoading }] = useUpdateTransaction();

  const initialValues = useMemo(
    () => ({
      amount: Math.abs(transaction.amount),
      type: (transaction.amount > 0 ? 'income' : 'expense') as 'income' | 'expense',
      memo: transaction.memo || '',
      accountId: transaction.account.id,
      categoryId: transaction.category?.id || '',
      issuedAt: new Date(transaction.issuedAt),
    }),
    [transaction],
  );

  return (
    <TransactionFormView
      mode="update"
      accounts={accounts}
      categories={{ income, expense }}
      submitLoading={updateLoading}
      initialLoading={accountLoading || categoriesLoading}
      initialValues={initialValues}
      onSubmit={async ({ type, ...values }) => {
        const { type: initialType, ...original } = initialValues;
        original.amount *= initialType === 'expense' ? -1 : 1;

        const toChange = filterUnchangedValues(
          { ...values, amount: type === 'expense' ? -values.amount : values.amount },
          original,
        );

        await updateTransaction(transaction.id, toChange, onClose);
      }}
    />
  );
};

export default UpdateTransactionDialog;
