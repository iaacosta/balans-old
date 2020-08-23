/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, Portal, Grid } from '@material-ui/core';
import _values from 'lodash/values';
import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';

import {
  UpdateUserMutation,
  UpdateUserMutationVariables,
  AllUsersQuery,
} from '../../@types/graphql';
import FormikTextField from '../formik/FormikTextField';
import FormikSelectField from '../formik/FormikSelectField';
import { roles } from '../../utils/rbac';
import { updateUserMutation } from '../../graphql/users';
import { filterUnchangedValues } from '../../utils/formik';
import FormikSubmitButton from '../formik/FormikSubmitButton';
import { useMe } from '../../hooks/auth/useMe';
import ResponsiveDialog from '../ui/ResponsiveDialog';

interface Props {
  user: AllUsersQuery['users'][number];
  open: boolean;
  onClose: () => void;
}

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().oneOf(_values(roles), 'Invalid option').required(),
  password: yup.string().min(6),
});

const UpdateUserDialog: React.FC<Props> = ({ user, open, onClose }) => {
  const { user: me } = useMe();
  const { enqueueSnackbar } = useSnackbar();
  const [updateUser, { loading }] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    updateUserMutation,
  );

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
    <Portal>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values) => {
          try {
            await updateUser({
              variables: {
                input: { id: user.id, ...filterUnchangedValues(values, initialValues) },
              },
            });
            enqueueSnackbar('User updated successfully', { variant: 'success' });
            onClose();
          } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        }}
      >
        {({ dirty }) => (
          <ResponsiveDialog open={open} onClose={onClose}>
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
              <DialogActions>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
                <FormikSubmitButton color="primary" disabled={!dirty} loading={loading}>
                  Update
                </FormikSubmitButton>
              </DialogActions>
            </Form>
          </ResponsiveDialog>
        )}
      </Formik>
    </Portal>
  );
};

export default UpdateUserDialog;
