/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from 'react';
import { Formik, FormikConfig, Form } from 'formik';
import * as yup from 'yup';
import { Grid, DialogTitle, DialogContent, makeStyles, Typography } from '@material-ui/core';
import { keyBy } from 'lodash';

import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import ContainerLoader from '../ui/misc/ContainerLoader';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import { MyAccountsQuery } from '../../@types/graphql';
import FormikCurrencyField from '../formik/FormikCurrencyField';
import FormikDatepicker from '../formik/FormikDatepicker';
import { useLocale } from '../../hooks/utils/useLocale';
import { LocaleKeys } from '../../@types/locales';
import accountingConstants from '../../constants/accountingConstants';

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
  const { locale } = useLocale();
  const localeKey: LocaleKeys = mode === 'create' ? 'forms:create' : 'forms:update';
  const accountsById = useMemo(() => keyBy(accounts, 'id'), [accounts]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        amount: yup.number().min(1).required(),
        memo: yup.string(),
        fromAccountId: yup
          .string()
          .notOneOf(
            [yup.ref('toAccountId')],
            locale('validation:custom:notOneOf', { value: locale('movements:form:fromAccount') }),
          )
          .required(),
        toAccountId: yup
          .string()
          .notOneOf(
            [yup.ref('fromAccountId')],
            locale('validation:custom:notOneOf', { value: locale('movements:form:toAccount') }),
          )
          .required(),
        issuedAt: yup.date().max(new Date()).required(),
      })}
      onSubmit={onSubmit}
    >
      {({ dirty, values }) => {
        const fromAccount = accountsById[values.fromAccountId as number];
        const toAccount = accountsById[values.toAccountId as number];
        const differentCurrencies = fromAccount.currency !== toAccount.currency;

        return (
          <Form className={classes.form}>
            <DialogTitle>
              {locale(localeKey)} {locale('movements:transfer').toLowerCase()}
            </DialogTitle>
            <DialogContent>
              {initialLoading ? (
                <ContainerLoader />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormikCurrencyField
                      name="amount"
                      label={locale('movements:form:amount')}
                      currency={fromAccount.currency}
                      fullWidth
                    />
                  </Grid>
                  {differentCurrencies && (
                    <>
                      <Grid item xs={6}>
                        <FormikCurrencyField
                          name="operationExchangeRate"
                          label="Tasa de cambio"
                          fullWidth
                          unbindDecimals
                          currency={toAccount.currency}
                          InputProps={{
                            endAdornment: <Typography>/{fromAccount.currency}$1</Typography>,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormikCurrencyField
                          value={
                            ((values.amount as number) * (values.operationExchangeRate as number)) /
                            10 ** accountingConstants[fromAccount.currency].decimalPlaces
                          }
                          name="noop"
                          label="Valor resultante"
                          currency={toAccount.currency}
                          fullWidth
                          disabled
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <FormikTextField name="memo" label={locale('movements:form:memo')} fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                    <FormikSelectField
                      name="fromAccountId"
                      label={locale('movements:form:fromAccount')}
                      fullWidth
                      displayEmpty
                      options={accounts.map(({ id, name, bank }) => ({
                        key: id,
                        label: `${name} (${bank})`,
                      }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormikSelectField
                      name="toAccountId"
                      label={locale('movements:form:toAccount')}
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
            <DialogFormButtons
              loading={submitLoading}
              disabled={mode === 'update' ? !dirty : false}
            >
              {locale(localeKey)}
            </DialogFormButtons>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TransferFormView;
