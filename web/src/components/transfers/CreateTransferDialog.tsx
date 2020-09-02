/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { map, capitalize } from 'lodash';

import { useMyDebitAccounts, useCreateTransfer } from '../../hooks/graphql';
import TransferFormView from './TransferFormView';
import DialogFormContext from '../../contexts/DialogFormContext';

const CreateTransferDialog: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const [createTransfer, { loading: createLoading }] = useCreateTransfer();

  const initialValues = useMemo(
    () => ({
      amount: 0,
      memo: '',
      fromAccountId: (accounts && accounts[0].id) || '',
      toAccountId: (accounts && accounts[1].id) || '',
    }),
    [accounts],
  );

  return (
    <TransferFormView
      mode="create"
      accounts={accounts}
      initialValues={initialValues}
      initialLoading={accountsLoading}
      submitLoading={createLoading}
      onSubmit={async (values) => {
        try {
          await createTransfer(values);
          enqueueSnackbar('Transfer created successfully', { variant: 'success' });
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

export default CreateTransferDialog;
