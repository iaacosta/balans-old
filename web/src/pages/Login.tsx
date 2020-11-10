import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { makeStyles, Box, Button, Typography, Grid, Hidden } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import FormikTextField from '../components/formik/FormikTextField';
import FormikSubmitButton from '../components/formik/FormikSubmitButton';
import routing from '../constants/routing';
import AuthWrapper from '../components/authenticate/AuthWrapper';
import { addToken } from '../slices/authSlice';
import FormikCheckbox from '../components/formik/FormikCheckbox';
import { UNKNOWN_ERROR } from '../constants/errorMessages';
import { useLogin } from '../hooks/graphql/authentication';
import { handleError } from '../utils/errors';
import { useLocale } from '../hooks/utils/useLocale';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const useStyles = makeStyles((theme) => ({
  form: { marginTop: theme.spacing(3) },
  buttons: { display: 'flex', justifyContent: 'flex-end' },
  signUp: { marginRight: theme.spacing(2) },
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [login, { loading }] = useLogin();
  const { locale } = useLocale();

  return (
    <AuthWrapper>
      <Typography variant="h2">{locale('auth:loginPage:title')}</Typography>
      <Hidden xsDown>
        <Typography variant="subtitle1">{locale('auth:loginPage:subtitle')}</Typography>
      </Hidden>
      <Formik
        initialValues={{ username: '', password: '', rememberMe: false }}
        validationSchema={schema}
        onSubmit={async ({ rememberMe, ...values }) => {
          try {
            const { data } = await login(values);
            if (data) {
              dispatch(addToken({ token: data.token }));
              if (rememberMe) localStorage.setItem('x-auth', data.token);
            } else {
              enqueueSnackbar(UNKNOWN_ERROR, { variant: 'error' });
            }
          } catch (err) {
            handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
          }
        }}
      >
        {() => (
          <Form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormikTextField name="username" label={locale('auth:common:username')} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  name="password"
                  type="password"
                  label={locale('auth:common:password')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormikCheckbox name="rememberMe" label={locale('auth:loginPage:rememberMe')} />
              </Grid>
              <Grid item xs={12}>
                <Box className={classes.buttons}>
                  <Button
                    component={Link}
                    to={routing.unauthenticated.signUp}
                    type="button"
                    className={classes.signUp}
                    color="secondary"
                  >
                    {locale('auth:common:signup')}
                  </Button>
                  <FormikSubmitButton loading={loading} color="primary">
                    {locale('auth:common:login')}
                  </FormikSubmitButton>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </AuthWrapper>
  );
};

export default Login;
