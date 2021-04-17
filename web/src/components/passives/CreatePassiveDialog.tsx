/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';

import { useMyDebitAccounts, useCreatePassive } from '../../hooks/graphql';
import PassiveFormView from './PassiveFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { initialEmptyNumber } from '../../utils/formik';
import { Currency } from '../../@types/graphql';

const CreatePassiveDialog: React.FC = () => {
  const { onClose } = useContext(DialogFormContext);
  const { accounts, loading: accountsLoading } = useMyDebitAccounts();
  const [createPassive, { loading: createLoading }] = useCreatePassive();

  const clpAccounts = useMemo(() => accounts.filter(({ currency }) => currency === Currency.Clp), [
    accounts,
  ]);

  const initialValues = useMemo(
    () => ({
      amount: initialEmptyNumber,
      type: 'debt' as 'debt' | 'loan',
      memo: '',
      issuedAt: new Date(),
      accountId: clpAccounts[0].id || '',
    }),
    [clpAccounts],
  );

  return (
    <PassiveFormView
      mode="create"
      accounts={clpAccounts}
      initialValues={initialValues}
      initialLoading={accountsLoading}
      submitLoading={createLoading}
      onSubmit={(values) => createPassive(values, onClose)}
    />
  );
};

export default CreatePassiveDialog;
