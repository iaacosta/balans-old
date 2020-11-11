/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useEffect, useContext } from 'react';
import { DialogTitle, DialogContent, Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import { AccountType } from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import DialogFormContext from '../../contexts/DialogFormContext';
import { useCreateDebitAccount } from '../../hooks/graphql';
import { handleError } from '../../utils/errors';
import FormikCurrencyField from '../formik/FormikCurrencyField';
import { initialEmptyNumber } from '../../utils/formik';
import { useLocale } from '../../hooks/utils/useLocale';
import { localeKeyFromAccountType } from '../../utils/accounts';

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

const CreateDebitAccountDialog: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { onClose } = useContext(DialogFormContext);
  const { locale } = useLocale();
  const [createDebitAccount, { loading }] = useCreateDebitAccount();

  const initialValues = useMemo(
    () => ({
      name: '',
      bank: '',
      initialBalance: initialEmptyNumber,
      type: '' as AccountType,
    }),
    [],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values) => {
        try {
          await createDebitAccount(values);
          enqueueSnackbar('Account created successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
        }
      }}
    >
      {({ values, setFieldValue }) => {
        useEffect(() => {
          if (values.type === 'cash') setFieldValue('bank', 'No bank');
        }, [values.type, setFieldValue]);

        return (
          <Form>
            <DialogTitle>{locale('accounts:form:title')}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormikTextField name="name" label={locale('accounts:form:name')} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <FormikSelectField
                    name="type"
                    label={locale('accounts:form:type')}
                    fullWidth
                    displayEmpty
                    options={[
                      {
                        key: AccountType.Cash,
                        label: locale(localeKeyFromAccountType(AccountType.Cash)),
                      },
                      {
                        key: AccountType.Vista,
                        label: locale(localeKeyFromAccountType(AccountType.Vista)),
                      },
                      {
                        key: AccountType.Checking,
                        label: locale(localeKeyFromAccountType(AccountType.Checking)),
                      },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikCurrencyField
                    name="initialBalance"
                    label={locale('accounts:form:initialBalance')}
                    fullWidth
                  />
                </Grid>
                {values.type !== 'cash' && (
                  <Grid item xs={12}>
                    <FormikSelectField
                      name="bank"
                      label={locale('accounts:form:bank')}
                      fullWidth
                      options={defaultBanks}
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogFormButtons loading={loading}>{locale('forms:create')}</DialogFormButtons>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateDebitAccountDialog;
