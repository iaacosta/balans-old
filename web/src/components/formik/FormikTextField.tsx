/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { TextFieldProps, TextField, makeStyles } from '@material-ui/core';
import { useField } from 'formik';

interface Props {
  name: string;
  label: string;
}

const useStyles = makeStyles((theme) => ({
  root: { minHeight: theme.spacing(10) },
}));

const FormikTextField: React.FC<Props & TextFieldProps> = ({ name, label, variant, ...props }) => {
  const classes = useStyles();
  const [fieldProps, { error, touched }] = useField(name);
  const hasError = !!error && touched;

  return (
    <TextField
      label={label}
      error={hasError}
      helperText={hasError && error}
      color="secondary"
      variant={variant || ('outlined' as any)}
      classes={classes}
      data-testid={`${name}Input`}
      {...props}
      {...fieldProps}
    />
  );
};

export default FormikTextField;
