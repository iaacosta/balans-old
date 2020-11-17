/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';

import { useMyDebitAccounts, useCreatePassive } from '../../hooks/graphql';
import PassiveFormView from './PassiveFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { initialEmptyNumber } from '../../utils/formik';

const CreatePassiveDialog: React.FC = () => {
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const [createPassive, { loading: createLoading }] = useCreatePassive();

  const initialValues = useMemo(
    () => ({
      amount: initialEmptyNumber,
      type: 'debt' as 'debt' | 'loan',
      memo: '',
      issuedAt: new Date(),
      accountId: (accounts && accounts[0].id) || '',
    }),
    [accounts],
  );

  return (
    <PassiveFormView
      mode="create"
      accounts={accounts}
      initialValues={initialValues}
      initialLoading={accountsLoading}
      submitLoading={createLoading}
      onSubmit={(values) => createPassive(values, onClose)}
    />
  );
};

export default CreatePassiveDialog;
