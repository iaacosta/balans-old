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

type KeyLabelOption = { key: string; label: string };
type KeyElementOption = { key: string; element: JSX.Element };
interface Props {
  name: string;
  label: string;
  options: (string | KeyLabelOption | KeyElementOption)[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: theme.spacing(10),
    [theme.breakpoints.down('xs')]: { minHeight: theme.spacing(5) },
  },
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
      data-testid={`${name}Input`}
    >
      <InputLabel color={color || 'secondary'}>{label}</InputLabel>
      <Select
        color={color || 'secondary'}
        label={label}
        fullWidth={fullWidth}
        {...props}
        {...fieldProps}
      >
        {options.map((option) => {
          let key: number | string;
          let optionLabel: React.ReactNode;

          if (typeof option === 'string') {
            key = option;
            optionLabel = option;
          } else if ((option as KeyLabelOption).label) {
            key = (option as KeyLabelOption).key;
            optionLabel = (option as KeyLabelOption).label;
          } else {
            key = option.key;
            optionLabel = (option as KeyElementOption).element;
          }

          return (
            <MenuItem key={key} value={key}>
              {optionLabel}
            </MenuItem>
          );
        })}
      </Select>
      {hasError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default FormikSelectField;
