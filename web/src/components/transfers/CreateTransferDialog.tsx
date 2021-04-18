/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';

import { useMyDebitAccounts, useCreateTransfer } from '../../hooks/graphql';
import TransferFormView from './TransferFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { initialEmptyNumber } from '../../utils/formik';

const CreateTransferDialog: React.FC = () => {
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const [createTransfer, { loading: createLoading }] = useCreateTransfer();

  const initialValues = useMemo(
    () => ({
      amount: initialEmptyNumber,
      memo: '',
      fromAccountId: accounts[0].id || '',
      toAccountId: accounts[1].id || '',
      operationExchangeRate: 1,
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
      onSubmit={(values) => createTransfer(values, onClose)}
    />
  );
};

export default CreateTransferDialog;
