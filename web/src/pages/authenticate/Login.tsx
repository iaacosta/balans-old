import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { makeStyles, Box, Button, Typography, Grid } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import FormikTextField from '../../components/formik/FormikTextField';
import FormikSubmitButton from '../../components/formik/FormikSubmitButton';
import { loginMutation } from '../../graphql/authentication';
import routing from '../../constants/routing';
import AuthWrapper from '../../components/authenticate/AuthWrapper';
import { addToken } from '../../config/redux';
import FormikCheckbox from '../../components/formik/FormikCheckbox';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const useStyles = makeStyles((theme) => ({
  fields: { marginTop: theme.spacing(3), marginBottom: theme.spacing(3) },
  buttons: { display: 'flex', justifyContent: 'flex-end' },
  signUp: { marginRight: theme.spacing(2) },
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [login, { loading }] = useMutation(loginMutation);

  return (
    <AuthWrapper>
      <Typography variant="h2">Welcome back!</Typography>
      <Typography variant="subtitle1">Please log in with your account or social media</Typography>
      <Formik
        initialValues={{ username: '', password: '', rememberMe: false }}
        validationSchema={schema}
        onSubmit={async ({ rememberMe, ...values }) => {
          try {
            const { data } = await login({ variables: values });
            dispatch(addToken(data.token));
            if (rememberMe) localStorage.setItem('x-auth', data.token);
          } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        }}
      >
        {() => (
          <Form>
            <Grid container spacing={2} className={classes.fields}>
              <Grid item xs={12}>
                <FormikTextField name="username" label="Username" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="password" type="password" label="Password" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikCheckbox name="rememberMe" label="Remember me?" />
              </Grid>
            </Grid>
            <Box className={classes.buttons}>
              <Button
                component={Link}
                to={routing.unauthenticated.signUp.path}
                type="button"
                className={classes.signUp}
                color="secondary"
              >
                Sign up
              </Button>
              <FormikSubmitButton loading={loading} color="primary">
                Log in
              </FormikSubmitButton>
            </Box>
          </Form>
        )}
      </Formik>
    </AuthWrapper>
  );
};

export default Login;
