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
import { UNKNOWN_ERROR } from '../constants/errorMessages';
import { useSignUp } from '../hooks/graphql/authentication';
import { handleError } from '../utils/errors';
import { useLocale } from '../hooks/utils/useLocale';

const useStyles = makeStyles((theme) => ({
  form: { marginTop: theme.spacing(3) },
  buttons: { display: 'flex', justifyContent: 'flex-end' },
  login: { marginRight: theme.spacing(2) },
}));

const SignUp: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [signUp, { loading }] = useSignUp();
  const { locale } = useLocale();

  return (
    <AuthWrapper>
      <Typography variant="h2">{locale('auth:signUpPage:title')}</Typography>
      <Hidden xsDown>
        <Typography variant="subtitle1">{locale('auth:signUpPage:subtitle')}</Typography>
      </Hidden>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={yup.object().shape({
          firstName: yup.string().required(),
          lastName: yup.string().required(),
          email: yup.string().email().required(),
          username: yup
            .string()
            .min(6)
            .matches(/^[\w\d\-_\\.]+$/i, locale('validation:custom:username'))
            .required(),
          password: yup.string().min(6).required(),
          confirmPassword: yup
            .string()
            .equals([yup.ref('password')], locale('validation:custom:passwordsDontMatch'))
            .required(),
        })}
        onSubmit={async ({ confirmPassword, ...values }) => {
          try {
            const { data } = await signUp(values);
            if (data) {
              dispatch(addToken({ token: data.token }));
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
                <FormikTextField
                  name="firstName"
                  label={locale('auth:signUpPage:firstName')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField
                  name="lastName"
                  label={locale('auth:signUpPage:lastName')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="email" label={locale('auth:signUpPage:email')} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="username" label={locale('auth:common:username')} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikTextField
                  name="password"
                  type="password"
                  label={locale('auth:common:password')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikTextField
                  name="confirmPassword"
                  type="password"
                  label={locale('auth:signUpPage:confirmPassword')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Box className={classes.buttons}>
                  <Button
                    component={Link}
                    to={routing.unauthenticated.login}
                    type="button"
                    className={classes.login}
                    color="secondary"
                  >
                    {locale('auth:common:login')}
                  </Button>
                  <FormikSubmitButton loading={loading} color="primary">
                    {locale('auth:common:signup')}
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

export default SignUp;
