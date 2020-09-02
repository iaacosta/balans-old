/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Formik, FormikConfig, Form } from 'formik';
import * as yup from 'yup';
import { InputAdornment, Grid, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';

import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import ContainerLoader from '../ui/misc/ContainerLoader';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import { MyAccountsQuery } from '../../@types/graphql';

type Props<T> = {
  initialValues: T;
  onSubmit: FormikConfig<T>['onSubmit'];
  accounts: MyAccountsQuery['accounts'];
  initialLoading: boolean;
  submitLoading: boolean;
  mode: 'update' | 'create';
};

const useStyles = makeStyles((theme) => ({
  form: { minWidth: theme.spacing(75), [theme.breakpoints.down('sm')]: { minWidth: 0 } },
}));

const TransferFormView = <T extends Record<string, unknown>>({
  initialValues,
  accounts,
  onSubmit,
  initialLoading,
  submitLoading,
  mode,
}: Props<T>): JSX.Element => {
  const classes = useStyles();
  const label = mode === 'create' ? 'Create' : 'Update';

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        amount: yup.number().min(1).required(),
        memo: yup.string(),
        fromAccountId: yup
          .string()
          .notOneOf([yup.ref('toAccountId')], 'Must be different from origin account')
          .required(),
        toAccountId: yup
          .string()
          .notOneOf([yup.ref('fromAccountId')], 'Must be different from destination account')
          .required(),
      })}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form className={classes.form}>
          <DialogTitle>{label} transfer</DialogTitle>
          <DialogContent>
            {initialLoading ? (
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
                  <FormikTextField name="memo" label="Memo" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <FormikSelectField
                    name="fromAccountId"
                    label="Origin account"
                    fullWidth
                    displayEmpty
                    options={accounts.map(({ id, name, bank }) => ({
                      key: id,
                      label: `${name} (${bank})`,
                    }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikSelectField
                    name="toAccountId"
                    label="Destination account"
                    fullWidth
                    displayEmpty
                    options={accounts.map(({ id, name, bank }) => ({
                      key: id,
                      label: `${name} (${bank})`,
                    }))}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogFormButtons loading={submitLoading} disabled={mode === 'update' ? !dirty : false}>
            {label}
          </DialogFormButtons>
        </Form>
      )}
    </Formik>
  );
};

export default TransferFormView;
