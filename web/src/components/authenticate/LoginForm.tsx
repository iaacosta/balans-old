import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { makeStyles, Box, Button, Typography } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';

import FormikTextField from '../formik/FormikTextField';
import FormikSubmitButton from '../formik/FormikSubmitButton';
import { loginMutation } from '../../graphql/authentication';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const useStyles = makeStyles((theme) => ({
  form: {
    '& > *:not(:last-child)': { marginBottom: theme.spacing(1) },
    '& > *:first-child': { marginTop: theme.spacing(3) },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  signUp: {
    marginRight: theme.spacing(2),
  },
}));

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [login, { loading }] = useMutation(loginMutation);

  return (
    <Box>
      <Typography variant="h2">Welcome back!</Typography>
      <Typography variant="subtitle1">Please sign-in with your account or social media</Typography>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await login({ variables: values });
          } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        }}
      >
        {() => (
          <Form className={classes.form}>
            <FormikTextField name="username" label="Username" fullWidth />
            <FormikTextField name="password" type="password" label="Password" fullWidth />
            <Box className={classes.buttons}>
              <Button type="button" className={classes.signUp} color="secondary">
                Sign up
              </Button>
              <FormikSubmitButton loading={loading} color="primary">
                Sign in
              </FormikSubmitButton>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;
