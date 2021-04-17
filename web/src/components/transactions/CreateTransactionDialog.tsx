/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';

import { useMyDebitAccounts, useCreateTransaction, useMyCategories } from '../../hooks/graphql';
import TransactionFormView from './TransactionFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { initialEmptyNumber } from '../../utils/formik';

const CreateTransactionDialog: React.FC = () => {
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const { income, expense, loading: categoriesLoading } = useMyCategories();
  const [createTransaction, { loading: createLoading }] = useCreateTransaction();

  const initialValues = useMemo(
    () => ({
      amount: initialEmptyNumber,
      type: 'expense' as 'expense' | 'income',
      memo: '',
      issuedAt: new Date(),
      accountId: (accounts && accounts[0].id) || '',
      categoryId: (expense && expense[0].id) || '',
    }),
    [accounts, expense],
  );

  return (
    <TransactionFormView
      mode="create"
      accounts={accounts}
      categories={{ income, expense }}
      initialValues={initialValues}
      initialLoading={accountsLoading || categoriesLoading}
      submitLoading={createLoading}
      onSubmit={(values) => createTransaction(values, onClose)}
    />
  );
};

export default CreateTransactionDialog;
