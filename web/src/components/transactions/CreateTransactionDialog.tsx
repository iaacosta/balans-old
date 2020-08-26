/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { map, capitalize } from 'lodash';

import {
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  MyAccountsQuery,
} from '../../@types/graphql';
import { createTransactionMutation, myTransactionsQuery } from '../../graphql/transaction';
import { myAccountsQuery } from '../../graphql/account';
import { useRedirectedQuery } from '../../hooks/graphql/useRedirectedQuery';
import TransactionFormView from './TransactionFormView';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateTransactionDialog: React.FC<Props> = ({ open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useRedirectedQuery<MyAccountsQuery>(myAccountsQuery);

  const [createTransaction, { loading: createLoading }] = useMutation<
    CreateTransactionMutation,
    CreateTransactionMutationVariables
  >(createTransactionMutation, {
    refetchQueries: [{ query: myTransactionsQuery }, { query: myAccountsQuery }],
  });

  const initialValues = useMemo(
    () => ({
      amount: 0,
      type: 'Expense',
      memo: '',
      accountId: (data?.accounts[0] && data?.accounts[0].id) || '',
    }),
    [data],
  );

  return (
    <TransactionFormView
      accounts={data?.accounts}
      mode="create"
      open={open}
      onClose={onClose}
      initialLoading={loading || !data}
      submitLoading={createLoading}
      initialValues={initialValues}
      onSubmit={async ({ type, amount, ...values }) => {
        try {
          await createTransaction({
            variables: {
              input: {
                ...values,
                amount: type === 'Expense' ? -amount : amount,
              },
            },
          });
          enqueueSnackbar('Transaction created successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          /* TODO: research how to handle globally this stuff */
          const [graphQLError] = err.graphQLErrors;
          if (graphQLError.extensions.code === 'BAD_USER_INPUT') {
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

export default CreateTransactionDialog;
