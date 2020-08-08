import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { makeStyles, Box, Button, Typography, Grid } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import FormikTextField from '../components/formik/FormikTextField';
import FormikSubmitButton from '../components/formik/FormikSubmitButton';
import { signUpMutation } from '../graphql/authentication';
import routing from '../constants/routing';
import AuthWrapper from '../components/authenticate/AuthWrapper';
import { addToken } from '../config/redux';
import { SignUpMutationVariables, SignUpMutation } from '../@types/graphql';
import { UNKNOWN_ERROR } from '../constants/errorMessages';

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  username: yup
    .string()
    .min(6)
    .matches(/^[\w\d\\-_\\.]+$/i, "Should only contain numbers, letters and '-', '_' or '.'")
    .required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .equals([yup.ref('password')], "Passwords don't match")
    .required(),
});

const useStyles = makeStyles((theme) => ({
  form: { marginTop: theme.spacing(3) },
  buttons: { display: 'flex', justifyContent: 'flex-end' },
  login: { marginRight: theme.spacing(2) },
}));

const SignUp: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [signUp, { loading }] = useMutation<SignUpMutation, SignUpMutationVariables>(
    signUpMutation,
  );

  return (
    <AuthWrapper>
      <Typography variant="h2">First time around?</Typography>
      <Typography variant="subtitle1">
        Fill up your data and become part of the community!
      </Typography>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={schema}
        onSubmit={async ({ confirmPassword, ...values }) => {
          try {
            const { data } = await signUp({ variables: { input: values } });
            if (data) {
              dispatch(addToken(data.token));
            } else {
              enqueueSnackbar(UNKNOWN_ERROR, { variant: 'error' });
            }
          } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        }}
      >
        {() => (
          <Form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormikTextField name="firstName" label="First name" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="lastName" label="Last name" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="email" label="Email" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="username" label="Username" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <FormikTextField name="password" type="password" label="Password" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <FormikTextField
                  name="confirmPassword"
                  type="password"
                  label="Confirm password"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box className={classes.buttons}>
              <Button
                component={Link}
                to={routing.unauthenticated.login}
                type="button"
                className={classes.login}
                color="secondary"
              >
                Log in
              </Button>
              <FormikSubmitButton loading={loading} color="primary">
                Sign up
              </FormikSubmitButton>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthWrapper>
  );
};

export default SignUp;
