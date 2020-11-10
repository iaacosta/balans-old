/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { useSnackbar } from 'notistack';

import { useMyDebitAccounts, useCreateTransfer } from '../../hooks/graphql';
import TransferFormView from './TransferFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { handleError } from '../../utils/errors';
import { initialEmptyNumber } from '../../utils/formik';

const CreateTransferDialog: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const [createTransfer, { loading: createLoading }] = useCreateTransfer();

  const initialValues = useMemo(
    () => ({
      amount: initialEmptyNumber,
      memo: '',
      fromAccountId: (accounts && accounts[0].id) || '',
      toAccountId: (accounts && accounts[1].id) || '',
      issuedAt: new Date(),
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
          await createTransfer({ ...values, issuedAt: values.issuedAt.valueOf() });
          enqueueSnackbar('Transfer created successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
        }
      }}
    />
  );
};

export default CreateTransferDialog;
