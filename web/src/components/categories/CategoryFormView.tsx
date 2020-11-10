import React from 'react';
import { Formik, FormikConfig, Form } from 'formik';
import * as yup from 'yup';
import { Grid, DialogTitle, DialogContent } from '@material-ui/core';

import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import colors from '../../constants/colors';
import FormikColorField from '../formik/FormikColorField';
import { useLocale } from '../../hooks/utils/useLocale';
import { LocaleKeys } from '../../@types/locales';

type Props<T> = {
  initialValues: T;
  onSubmit: FormikConfig<T>['onSubmit'];
  submitLoading: boolean;
  mode: 'update' | 'create';
};

const CategoryFormView = <T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  submitLoading,
  mode,
}: Props<T>): JSX.Element => {
  const { locale } = useLocale();
  const localeKey: LocaleKeys = mode === 'create' ? 'forms:create' : 'forms:update';

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        name: yup.string().required(),
        color: yup.string().oneOf(colors),
        type: yup.string().oneOf(['income', 'expense']),
      })}
      onSubmit={onSubmit}
    >
      {({ dirty }) => (
        <Form>
          <DialogTitle>{locale(localeKey)} category</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormikTextField name="name" label={locale('categories:form:name')} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikSelectField
                  name="type"
                  label={locale('categories:form:type')}
                  fullWidth
                  displayEmpty
                  options={[
                    { label: locale('categories:income'), key: 'income' },
                    { label: locale('categories:expense'), key: 'expense' },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <FormikColorField
                  name="color"
                  label={locale('categories:form:color')}
                  fullWidth
                  options={colors}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogFormButtons loading={submitLoading} disabled={mode === 'update' ? !dirty : false}>
            {locale(localeKey)}
          </DialogFormButtons>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryFormView;
