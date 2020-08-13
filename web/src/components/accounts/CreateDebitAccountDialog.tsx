/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Portal,
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
import { createDebitAccountMutation } from '../../graphql/account';

interface Props {
  open: boolean;
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

const CreateDebitAccountDialog: React.FC<Props> = ({ open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [createDebitAccount, { loading }] = useMutation<
    CreateDebitAccountMutation,
    CreateDebitAccountMutationVariables
  >(createDebitAccountMutation);

  const initialValues = useMemo(
    () => ({
      name: '',
      bank: '',
      initialBalance: ('' as unknown) as number,
      type: '' as AccountType,
    }),
    [],
  );

  return (
    <Portal>
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
        {() => (
          <Dialog open={open} onClose={onClose}>
            <Form>
              <DialogTitle>Create account</DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormikTextField name="name" label="Name" fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <FormikSelectField name="bank" label="Bank" fullWidth options={defaultBanks} />
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
          </Dialog>
        )}
      </Formik>
    </Portal>
  );
};

export default CreateDebitAccountDialog;
