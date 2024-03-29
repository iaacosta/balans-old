/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { DialogTitle, DialogContent, Grid } from '@material-ui/core';
import _values from 'lodash/values';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import { AllUsersQuery } from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import { roles } from '../../utils/rbac';
import { filterUnchangedValues } from '../../utils/formik';
import { useMe } from '../../hooks/auth/useMe';
import DialogFormContext from '../../contexts/DialogFormContext';
import DialogFormButtons from '../ui/dialogs/DialogFormButtons';
import { useUpdateUser } from '../../hooks/graphql';
import { useLocale } from '../../hooks/utils/useLocale';

interface Props {
  user: AllUsersQuery['users'][number];
}

const UpdateUserDialog: React.FC<Props> = ({ user }) => {
  const { user: me } = useMe();
  const { onClose } = useContext(DialogFormContext);
  const { locale } = useLocale();
  const [updateUser, { loading }] = useUpdateUser();

  const initialValues = useMemo(
    () => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: '',
    }),
    [user],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().email().required(),
        role: yup
          .string()
          .oneOf(_values(roles), locale('validation:custom:invalidOption'))
          .required(),
        password: yup.string().min(6),
      })}
      onSubmit={(values) =>
        updateUser(user.id, filterUnchangedValues(values, initialValues), onClose)
      }
    >
      {({ dirty }) => (
        <Form>
          <DialogTitle>
            {locale('forms:update')} @{user.username}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormikTextField
                  name="firstName"
                  label={locale('auth:signUpPage:firstName')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikTextField
                  name="lastName"
                  label={locale('auth:signUpPage:lastName')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="email" label={locale('auth:signUpPage:email')} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikSelectField
                  name="role"
                  label={locale('users:form:role')}
                  disabled={me!.id === user.id}
                  fullWidth
                  options={[
                    { key: roles.USER, label: 'User' },
                    { key: roles.ADMIN, label: 'Admin' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikTextField
                  name="password"
                  type="password"
                  label={locale('auth:common:password')}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogFormButtons disabled={!dirty} loading={loading}>
            {locale('forms:update')}
          </DialogFormButtons>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateUserDialog;
