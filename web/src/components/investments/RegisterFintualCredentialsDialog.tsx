/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { DialogTitle, DialogContent, Grid, DialogContentText, Link } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import FormikTextField from '../formik/FormikTextField';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import DialogFormContext from '../../contexts/DialogFormContext';
import { useRegisterFintualCredentials } from '../../hooks/graphql';
import { useLocale } from '../../hooks/utils/useLocale';
import { useFintualToken } from '../../hooks/api/useFintual';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const RegisterFintualCredentialsDialog: React.FC = () => {
  const { onClose } = useContext(DialogFormContext);
  const { locale } = useLocale();
  const [fetchToken, { isLoading: tokenLoading }] = useFintualToken();
  const [registerCredentials, { loading }] = useRegisterFintualCredentials();

  const initialValues = useMemo(() => ({ email: '', password: '' }), []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values) => {
        const data = await fetchToken(values);
        if (!data) return;
        await registerCredentials(data, onClose);
      }}
    >
      {() => (
        <Form>
          <DialogTitle>Fintual log in</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Don&apos;t worry, <b>we will never store your passwords</b>. We only store your email
              and token (both encrypted) so that <i>balans</i> can make requests to the Fintual API.
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormikTextField name="email" label={locale('auth:signUpPage:email')} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  name="password"
                  type="password"
                  label={locale('auth:common:password')}
                  fullWidth
                />
              </Grid>
            </Grid>
            <DialogContentText>
              If you are a bit suspicious feel free to check{' '}
              <Link
                color="secondary"
                href="https://edu.fintual.cl/el-api-de-fintual/"
                target="_blank"
              >
                this post
              </Link>
              , where one of the co-founders of Fintual explains exactly how anyone should use their
              API.
            </DialogContentText>
            <DialogContentText>
              You can also check{' '}
              <Link color="secondary" target="_blank" href="https://github.com/iaacosta/balans">
                our repository
              </Link>{' '}
              and write an issue so that we can improve!
            </DialogContentText>
          </DialogContent>
          <DialogFormButtons loading={loading || tokenLoading}>
            {locale('forms:create')}
          </DialogFormButtons>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterFintualCredentialsDialog;
