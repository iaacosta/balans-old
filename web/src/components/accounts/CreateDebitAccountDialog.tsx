/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  InputAdornment,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';

import {
  CreateDebitAccountMutation,
  CreateDebitAccountMutationVariables,
  AccountType,
} from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import FormikSubmitButton from '../formik/FormikSubmitButton';
import { createDebitAccountMutation, myAccountsQuery } from '../../graphql/account';
import { myTransactionsQuery } from '../../graphql/transaction';

interface Props {
  onClose: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  bank: yup.string().required(),
  initialBalance: yup.number().when('type', {
    is: (value) => value !== 'checking',
    then: yup.number().required().min(0),
    otherwise: yup.number().required(),
  }),
  type: yup.string().oneOf(['checking', 'vista', 'cash']).required(),
});

const defaultBanks = [
  'Santander',
  'Santander Banefe',
  'Scotiabank',
  'BICE',
  'Internacional',
  'Itaú',
  'Chile / Edwards-Citi',
  'Corpbanca',
  'Crédito e Inversiones',
  'Desarrollo',
  'Estado',
  'Falabella',
  'Security',
  'Rabobank',
  'HSBC Bank',
  'Ripley',
  'Paris',
  'Consorcio',
  'Coopeuch',
];

const CreateDebitAccountDialog: React.FC<Props> = ({ onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [createDebitAccount, { loading }] = useMutation<
    CreateDebitAccountMutation,
    CreateDebitAccountMutationVariables
  >(createDebitAccountMutation, {
    refetchQueries: [{ query: myAccountsQuery }, { query: myTransactionsQuery }],
  });

  const initialValues = useMemo(
    () => ({
      name: '',
      bank: '',
      initialBalance: 0,
      type: '' as AccountType,
    }),
    [],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values) => {
        try {
          await createDebitAccount({ variables: { input: values } });
          enqueueSnackbar('Account created successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          enqueueSnackbar(err.message, { variant: 'error' });
        }
      }}
    >
      {({ values, setFieldValue }) => {
        useEffect(() => {
          if (values.type === 'cash') setFieldValue('bank', 'No bank');
        }, [values.type, setFieldValue]);

        return (
          <Form>
            <DialogTitle>Create account</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormikTextField name="name" label="Name" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <FormikSelectField
                    name="type"
                    label="Type"
                    fullWidth
                    displayEmpty
                    options={[
                      { key: AccountType.Cash, label: 'Cash' },
                      { key: AccountType.Vista, label: 'Vista' },
                      { key: AccountType.Checking, label: 'Checking' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="initialBalance"
                    label="Initial Balance"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    fullWidth
                  />
                </Grid>
                {values.type !== 'cash' && (
                  <Grid item xs={12}>
                    <FormikSelectField name="bank" label="Bank" fullWidth options={defaultBanks} />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Cancel
              </Button>
              <FormikSubmitButton color="primary" loading={loading}>
                Create
              </FormikSubmitButton>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateDebitAccountDialog;
