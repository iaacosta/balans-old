/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { DialogTitle, DialogContent, Grid } from '@material-ui/core';
import _values from 'lodash/values';
import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';
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
import { handleError } from '../../utils/errors';

interface Props {
  user: AllUsersQuery['users'][number];
}

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().oneOf(_values(roles), 'Invalid option').required(),
  password: yup.string().min(6),
});

const UpdateUserDialog: React.FC<Props> = ({ user }) => {
  const { user: me } = useMe();
  const { enqueueSnackbar } = useSnackbar();
  const { onClose } = useContext(DialogFormContext);
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
      validationSchema={schema}
      onSubmit={async (values) => {
        try {
          await updateUser({ id: user.id, ...filterUnchangedValues(values, initialValues) });
          enqueueSnackbar('User updated successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
        }
      }}
    >
      {({ dirty }) => (
        <Form>
          <DialogTitle>Update user @{user.username}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormikTextField name="firstName" label="First name" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikTextField name="lastName" label="Last name" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormikTextField name="email" label="Email" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikSelectField
                  name="role"
                  label="Role"
                  disabled={me!.id === user.id}
                  fullWidth
                  options={[
                    { key: roles.USER, label: 'User' },
                    { key: roles.ADMIN, label: 'Admin' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikTextField name="password" type="password" label="Password" fullWidth />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogFormButtons disabled={!dirty} loading={loading}>
            Update
          </DialogFormButtons>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateUserDialog;
