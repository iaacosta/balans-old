/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Portal,
  Grid,
  InputAdornment,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import { map, capitalize } from 'lodash';

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
import { useRedirectedQuery } from '../../hooks/graphql/useRedirectedQuery';
import ResponsiveDialog from '../ui/ResponsiveDialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  form: { minWidth: theme.spacing(75), [theme.breakpoints.down('sm')]: { minWidth: 0 } },
}));

const schema = yup.object().shape({
  amount: yup.number().min(1).required(),
  memo: yup.string(),
  accountId: yup.string().required(),
});

const FormWrapper: React.FC<Props & { loading: boolean }> = ({
  open,
  onClose,
  children,
  loading,
}) => {
  const classes = useStyles();

  return (
    <ResponsiveDialog open={open} onClose={onClose}>
      <Form className={classes.form}>
        <DialogTitle>Create transaction</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <FormikSubmitButton color="primary" loading={loading}>
            Create
          </FormikSubmitButton>
        </DialogActions>
      </Form>
    </ResponsiveDialog>
  );
};

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

  if (loading || !data) {
    return (
      <FormWrapper open={open} onClose={onClose} loading={createLoading}>
        <ContainerLoader />
      </FormWrapper>
    );
  }

  return (
    <Portal>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
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
      >
        {() => (
          <FormWrapper open={open} onClose={onClose} loading={createLoading}>
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
                  name="type"
                  label="Transaction type"
                  fullWidth
                  displayEmpty
                  options={['Expense', 'Income']}
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="memo" label="Memo" fullWidth />
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
          </FormWrapper>
        )}
      </Formik>
    </Portal>
  );
};

export default CreateTransactionDialog;
