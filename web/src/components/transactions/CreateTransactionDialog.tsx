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
  makeStyles,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';

import {
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  MyAccountsQuery,
} from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import FormikSubmitButton from '../formik/FormikSubmitButton';
import { createTransactionMutation, myTransactionsQuery } from '../../graphql/transaction';
import { myAccountsQuery } from '../../graphql/account';
import ContainerLoader from '../ui/ContainerLoader';
import { useRedirectedQuery } from '../../hooks/useRedirectedQuery';

interface Props {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  form: { minWidth: theme.spacing(75) },
}));

const schema = yup.object().shape({
  amount: yup
    .number()
    .test('nonZero', 'Must be a non-zero amount', (value) => value !== 0)
    .required(),
  accountId: yup.string().required(),
});

const CreateTransactionDialog: React.FC<Props> = ({ open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
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
      accountId: '',
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
            await createTransaction({ variables: { input: values } });
            enqueueSnackbar('Transaction created successfully', { variant: 'success' });
            onClose();
          } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        }}
      >
        {() => (
          <Dialog open={open} onClose={onClose}>
            <Form className={classes.form}>
              <DialogTitle>Create transaction</DialogTitle>
              <DialogContent>
                {loading || !data ? (
                  <ContainerLoader />
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormikTextField
                        name="amount"
                        label="Amount"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormikSelectField
                        name="accountId"
                        label="Account"
                        fullWidth
                        displayEmpty
                        options={data.accounts.map(({ id, name, bank }) => ({
                          key: id,
                          label: `${name} (${bank})`,
                        }))}
                      />
                    </Grid>
                  </Grid>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
                <FormikSubmitButton color="primary" loading={createLoading}>
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

export default CreateTransactionDialog;
