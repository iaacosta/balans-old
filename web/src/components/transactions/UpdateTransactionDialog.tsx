/* eslint-disable operator-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { map, capitalize } from 'lodash';

import { MyTransactionsQuery } from '../../@types/graphql';
import { useMyDebitAccounts, useUpdateTransaction } from '../../hooks/graphql';
import TransactionFormView from './TransactionFormView';
import { filterUnchangedValues } from '../../utils/formik';
import DialogFormContext from '../../contexts/DialogFormContext';
import { useMyCategories } from '../../hooks/graphql/category';

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
      type: transaction.amount > 0 ? 'Income' : 'Expense',
      memo: transaction.memo || '',
      accountId: transaction.account.id,
      categoryId: transaction.category?.id || '',
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
        const toChange = { ...values, amount: type === 'Expense' ? -amount : amount };
        const { type: initialType, ...original } = initialValues;
        original.amount = original.amount * (initialType === 'Expense' ? -1 : 1);

        try {
          await updateTransaction({
            id: transaction.id,
            ...filterUnchangedValues(toChange, original),
          });
          enqueueSnackbar('Transaction updated successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          /* TODO: research how to handle globally this stuff */
          const [graphQLError] = err.graphQLErrors;
          if (graphQLError.extensions.code === 'BAD_USER_INPUT') {
            console.log(graphQLError.extensions);
            const messages = map(graphQLError.extensions.fields, (value, idx) => (
              <Typography key={idx} variant="body2">
                {capitalize(value)}
              </Typography>
            ));

            enqueueSnackbar(messages, { variant: 'error' });
          } else {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        }
      }}
    />
  );
};

export default UpdateTransactionDialog;
