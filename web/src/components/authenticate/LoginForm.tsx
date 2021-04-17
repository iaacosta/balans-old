import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { makeStyles, Box, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import FormikTextField from '../formik/FormikTextField';
import FormikSubmitButton from '../formik/FormikSubmitButton';
import routing from '../../constants/routing';
import FormikCheckbox from '../formik/FormikCheckbox';
import { useLogin } from '../../hooks/graphql';
import { useLocale } from '../../hooks/utils/useLocale';

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const useStyles = makeStyles((theme) => ({
  form: { marginTop: theme.spacing(3) },
  buttons: { display: 'flex', justifyContent: 'flex-end' },
  signUp: { marginRight: theme.spacing(2) },
}));

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const [login, { loading }] = useLogin();
  const { locale } = useLocale();

  return (
    <Formik
      initialValues={{ username: '', password: '', rememberMe: false }}
      validationSchema={schema}
      onSubmit={(values) => login(values)}
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
  );
};

export default LoginForm;
