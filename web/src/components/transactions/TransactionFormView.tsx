import React from 'react';
import { Formik, FormikConfig, Form } from 'formik';
import * as yup from 'yup';
import {
  InputAdornment,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ButtonProps as TButtonProps,
  makeStyles,
  Portal,
} from '@material-ui/core';

import { MyAccountsQuery } from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import ContainerLoader from '../ui/ContainerLoader';
import ResponsiveDialog from '../ui/ResponsiveDialog';
import FormikSubmitButton from '../formik/FormikSubmitButton';

type Props<T> = {
  initialValues: T;
  onSubmit: FormikConfig<T>['onSubmit'];
  accounts?: MyAccountsQuery['accounts'];
  open: boolean;
  onClose: () => void;
  initialLoading: boolean;
  submitLoading: boolean;
  mode: 'update' | 'create';
};

type WrapperProps = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  ButtonProps?: TButtonProps;
};

const useStyles = makeStyles((theme) => ({
  form: { minWidth: theme.spacing(75), [theme.breakpoints.down('sm')]: { minWidth: 0 } },
}));

const TransactionDialogWrapper: React.FC<WrapperProps> = ({
  open,
  onClose,
  children,
  loading,
  ButtonProps,
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
          <FormikSubmitButton color="primary" loading={loading} {...ButtonProps}>
            Create
          </FormikSubmitButton>
        </DialogActions>
      </Form>
    </ResponsiveDialog>
  );
};

const TransactionFormView = <T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  accounts,
  open,
  onClose,
  initialLoading,
  submitLoading,
  mode,
}: Props<T>): JSX.Element => {
  if (initialLoading || !accounts) {
    return (
      <Portal>
        <TransactionDialogWrapper open={open} onClose={onClose} loading={initialLoading}>
          <ContainerLoader />
        </TransactionDialogWrapper>
      </Portal>
    );
  }

  return (
    <Portal>
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          amount: yup.number().min(1).required(),
          memo: yup.string(),
          accountId: yup.string().required(),
        })}
        onSubmit={onSubmit}
      >
        {({ dirty }) => (
          <TransactionDialogWrapper
            open={open}
            onClose={onClose}
            loading={submitLoading}
            ButtonProps={{ disabled: mode === 'update' ? !dirty : false }}
          >
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
          </TransactionDialogWrapper>
        )}
      </Formik>
    </Portal>
  );
};

export default TransactionFormView;
