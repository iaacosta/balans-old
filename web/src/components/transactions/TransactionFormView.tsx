/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { Formik, FormikConfig, Form } from 'formik';
import * as yup from 'yup';
import { Grid, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';

import { MyAccountsQuery, MyCategoriesQuery } from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import ContainerLoader from '../ui/misc/ContainerLoader';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import CategorySelectItem from '../ui/misc/CategorySelectItem';
import FormikCurrencyField from '../formik/FormikCurrencyField';
import FormikDatepicker from '../formik/FormikDatepicker';
import { useLocale } from '../../hooks/utils/useLocale';
import { LocaleKeys } from '../../@types/locales';

type Props<T> = {
  initialValues: T;
  onSubmit: FormikConfig<T>['onSubmit'];
  accounts: MyAccountsQuery['accounts'];
  categories: { income: MyCategoriesQuery['income']; expense: MyCategoriesQuery['expense'] };
  initialLoading: boolean;
  submitLoading: boolean;
  mode: 'update' | 'create';
};

type TransactionType = 'expense' | 'income';

const useStyles = makeStyles((theme) => ({
  form: { minWidth: theme.spacing(75), [theme.breakpoints.down('sm')]: { minWidth: 0 } },
}));

const TransactionFormView = <T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  accounts,
  categories,
  initialLoading,
  submitLoading,
  mode,
}: Props<T>): JSX.Element => {
  const classes = useStyles();
  const { locale } = useLocale();
  const localeKey: LocaleKeys = mode === 'create' ? 'forms:create' : 'forms:update';
  const getCategoriesByType = (type: TransactionType) => categories[type];

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
      {({ dirty, values, setFieldValue }) => {
        const [internalCategories, setCategories] = useState(
          getCategoriesByType(values.type as TransactionType),
        );

        useEffect(() => {
          const newCategories = getCategoriesByType(values.type as TransactionType);
          let newCategory = newCategories[0].id;

          if (mode === 'update' && initialValues.type === values.type) {
            newCategory = initialValues.categoryId as string;
          }

          setCategories(newCategories);
          setFieldValue('categoryId', newCategory);
        }, [values.type, setFieldValue]);

        return (
          <Form className={classes.form}>
            <DialogTitle>
              {locale(localeKey)} {locale('movements:transaction').toLowerCase()}
            </DialogTitle>
            <DialogContent>
              {initialLoading || !accounts ? (
                <ContainerLoader />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormikCurrencyField
                      name="amount"
                      label={locale('movements:form:amount')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormikSelectField
                      name="type"
                      label={locale('movements:form:transactionType')}
                      fullWidth
                      displayEmpty
                      options={[
                        { key: 'expense', label: locale('categories:expense') },
                        { key: 'income', label: locale('categories:income') },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormikSelectField
                      name="categoryId"
                      label={locale('movements:form:category')}
                      fullWidth
                      displayEmpty
                      options={internalCategories.map((category) => ({
                        key: category.id,
                        element: <CategorySelectItem category={category} key={category.id} />,
                      }))}
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

export default TransactionFormView;
