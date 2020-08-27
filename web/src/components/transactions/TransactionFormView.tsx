import React from 'react';
import { Formik, FormikConfig, Form } from 'formik';
import * as yup from 'yup';
import { InputAdornment, Grid, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';

import { MyAccountsQuery } from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import ContainerLoader from '../ui/misc/ContainerLoader';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';

type Props<T> = {
  initialValues: T;
  onSubmit: FormikConfig<T>['onSubmit'];
  accounts?: MyAccountsQuery['accounts'];
  initialLoading: boolean;
  submitLoading: boolean;
  mode: 'update' | 'create';
};

const useStyles = makeStyles((theme) => ({
  form: { minWidth: theme.spacing(75), [theme.breakpoints.down('sm')]: { minWidth: 0 } },
}));

const TransactionFormView = <T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  accounts,
  initialLoading,
  submitLoading,
  mode,
}: Props<T>): JSX.Element => {
  const classes = useStyles();
  const label = mode === 'create' ? 'Create' : 'Update';

  let Node = <ContainerLoader />;

  if (!initialLoading && accounts) {
    Node = (
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
            options={accounts.map(({ id, name, bank }) => ({
              key: id,
              label: `${name} (${bank})`,
            }))}
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        amount: yup.number().min(1).required(),
        memo: yup.string(),
        accountId: yup.string().required(),
      })}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form className={classes.form}>
          <DialogTitle>{label} transaction</DialogTitle>
          <DialogContent>{Node}</DialogContent>
          <DialogFormButtons loading={submitLoading} disabled={mode === 'update' ? !dirty : false}>
            {label}
          </DialogFormButtons>
        </Form>
      )}
    </Formik>
  );
};

export default TransactionFormView;
