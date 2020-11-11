/* eslint-disable operator-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { useSnackbar } from 'notistack';

import { MyTransactionsQuery } from '../../@types/graphql';
import { useMyDebitAccounts, useUpdateTransaction } from '../../hooks/graphql';
import TransactionFormView from './TransactionFormView';
import { filterUnchangedValues } from '../../utils/formik';
import DialogFormContext from '../../contexts/DialogFormContext';
import { useMyCategories } from '../../hooks/graphql/category';
import { handleError } from '../../utils/errors';

interface Props {
  transaction: MyTransactionsQuery['transactions'][number];
}

const UpdateTransactionDialog: React.FC<Props> = ({ transaction }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountLoading } = useMyDebitAccounts();
  const { income, expense, loading: categoriesLoading } = useMyCategories();
  const [updateTransaction, { loading: updateLoading }] = useUpdateTransaction();

  const initialValues = useMemo(
    () => ({
      amount: Math.abs(transaction.amount),
      type: transaction.amount > 0 ? 'income' : 'expense',
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
      onSubmit={async ({ type, amount, ...values }) => {
        const { type: initialType, ...original } = initialValues;
        original.amount = original.amount * (initialType === 'expense' ? -1 : 1);

        const toChange = filterUnchangedValues(
          { ...values, amount: type === 'expense' ? -amount : amount },
          original,
        );

        try {
          await updateTransaction({
            id: transaction.id,
            ...toChange,
            issuedAt: toChange.issuedAt?.valueOf(),
          });
          enqueueSnackbar('Transaction updated successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
        }
      }}
    />
  );
};

export default UpdateTransactionDialog;
