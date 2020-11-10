/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { useSnackbar } from 'notistack';

import { useMyDebitAccounts, useCreateTransaction } from '../../hooks/graphql';
import TransactionFormView from './TransactionFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { useMyCategories } from '../../hooks/graphql/category';
import { handleError } from '../../utils/errors';
import { initialEmptyNumber } from '../../utils/formik';

const CreateTransactionDialog: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const { income, expense, loading: categoriesLoading } = useMyCategories();
  const [createTransaction, { loading: createLoading }] = useCreateTransaction();

  const initialValues = useMemo(
    () => ({
      amount: initialEmptyNumber,
      type: 'expense',
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
      onSubmit={async ({ type, amount, issuedAt, ...values }) => {
        try {
          await createTransaction({
            ...values,
            amount: type === 'expense' ? -amount : amount,
            issuedAt: issuedAt.valueOf(),
          });
          enqueueSnackbar('Transaction created successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
        }
      }}
    />
  );
};

export default CreateTransactionDialog;
