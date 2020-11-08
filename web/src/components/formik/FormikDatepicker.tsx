import React from 'react';
import { DateTimePicker, DateTimePickerProps } from '@material-ui/pickers';
import { useField } from 'formik';
import { makeStyles } from '@material-ui/core';
import { longDateFormat } from '../../utils/date';

interface Props {
  name: string;
  label: string;
}

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialogActions-root button.MuiButtonBase-root': { color: theme.palette.secondary.main },
  },
}));

const FormikDatepicker: React.FC<Props & Omit<DateTimePickerProps, 'value' | 'onChange'>> = ({
  name,
  label,
  ...props
}) => {
  const classes = useStyles();
  const [{ value, onChange, ...otherProps }, { error, touched }, { setValue }] = useField(name);
  const hasError = touched && !!error;

  return (
    <DateTimePicker
      inputVariant="outlined"
      fullWidth
      color="secondary"
      value={value}
      label={label}
      onChange={(date) => setValue(date)}
      format={longDateFormat}
      error={hasError}
      helperText={hasError && error}
      disableFuture
      DialogProps={{ className: classes.dialog }}
      {...otherProps}
      {...props}
    />
  );
};

export default FormikDatepicker;
