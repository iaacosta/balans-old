/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Formik, FormikConfig, Form } from 'formik';
import * as yup from 'yup';
import { Grid, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';

import { MyAccountsQuery } from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import ContainerLoader from '../ui/misc/ContainerLoader';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import FormikCurrencyField from '../formik/FormikCurrencyField';
import FormikDatepicker from '../formik/FormikDatepicker';
import { useLocale } from '../../hooks/utils/useLocale';
import { LocaleKeys } from '../../@types/locales';

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

const PassiveFormView = <T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  accounts,
  initialLoading,
  submitLoading,
  mode,
}: Props<T>): JSX.Element => {
  const classes = useStyles();
  const { locale } = useLocale();
  const localeKey: LocaleKeys = mode === 'create' ? 'forms:create' : 'forms:update';

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        amount: yup.number().min(1).required(),
        memo: yup.string(),
        accountId: yup.string().required(),
        categoryId: yup.string(),
        issuedAt: yup.date().max(new Date()).required(),
      })}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form className={classes.form}>
          <DialogTitle>
            {locale(localeKey)} {locale('elements:singular:passive').toLowerCase()}
          </DialogTitle>
          <DialogContent>
            {initialLoading || !accounts ? (
              <ContainerLoader />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormikCurrencyField
                    name="amount"
                    label={locale('movements:form:amount')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormikSelectField
                    name="type"
                    label={locale('movements:form:passiveType')}
                    fullWidth
                    displayEmpty
                    options={[
                      { key: 'debt', label: locale('elements:singular:debt') },
                      { key: 'loan', label: locale('elements:singular:loan') },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField name="memo" label="Memo" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <FormikSelectField
                    name="accountId"
                    label={locale('movements:form:account')}
                    fullWidth
                    displayEmpty
                    options={accounts.map(({ id, name, bank }) => ({
                      key: id,
                      label: `${name} (${bank})`,
                    }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikDatepicker name="issuedAt" label={locale('movements:form:issuedAt')} />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogFormButtons loading={submitLoading} disabled={mode === 'update' ? !dirty : false}>
            {locale(localeKey)}
          </DialogFormButtons>
        </Form>
      )}
    </Formik>
  );
};

export default PassiveFormView;
