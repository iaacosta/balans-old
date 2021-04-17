/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';

import { useMyDebitAccounts, useCreateTransfer } from '../../hooks/graphql';
import TransferFormView from './TransferFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { initialEmptyNumber } from '../../utils/formik';
import { Currency } from '../../@types/graphql';

const CreateTransferDialog: React.FC = () => {
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const [createTransfer, { loading: createLoading }] = useCreateTransfer();

  const clpAccounts = useMemo(() => accounts.filter(({ currency }) => currency === Currency.Clp), [
    accounts,
  ]);

  const initialValues = useMemo(
    () => ({
      amount: initialEmptyNumber,
      memo: '',
      fromAccountId: clpAccounts[0].id || '',
      toAccountId: clpAccounts[1].id || '',
      issuedAt: new Date(),
    }),
    [clpAccounts],
  );

  return (
    <TransferFormView
      mode="create"
      accounts={clpAccounts}
      initialValues={initialValues}
      initialLoading={accountsLoading}
      submitLoading={createLoading}
      onSubmit={(values) => createTransfer(values, onClose)}
    />
  );
};

export default CreateTransferDialog;
