/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  makeStyles,
  InputLabel,
  FormControl,
  Select,
  SelectProps,
  FormHelperText,
  MenuItem,
} from '@material-ui/core';
import { useField } from 'formik';

interface Props {
  name: string;
  label: string;
  options: { key: string; label: string }[];
}

const useStyles = makeStyles((theme) => ({
  root: { minHeight: theme.spacing(10) },
}));

const FormikSelectField: React.FC<Props & SelectProps> = ({
  name,
  label,
  options,
  variant,
  fullWidth,
  color,
  ...props
}) => {
  const classes = useStyles();
  const [fieldProps, { error, touched }] = useField(name);
  const hasError = !!error && touched;

  return (
    <FormControl
      variant={variant || ('outlined' as any)}
      error={hasError}
      classes={classes}
      fullWidth={fullWidth}
    >
      <InputLabel color={color || 'secondary'}>{label}</InputLabel>
      <Select
        color={color || 'secondary'}
        label={label}
        data-testid={`${name}Input`}
        fullWidth={fullWidth}
        {...props}
        {...fieldProps}
      >
        {options.map(({ key, label: optionLabel }) => (
          <MenuItem key={key} value={key}>
            {optionLabel}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FormikSelectField;