/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  InputAdornment,
  InputBaseComponentProps,
  makeStyles,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { useField } from 'formik';
import { Currency } from '../../@types/graphql';
import accountingConstants from '../../constants/accountingConstants';

interface Props {
  name: string;
  label: string;
  currency?: Currency;
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: theme.spacing(10),
    [theme.breakpoints.down('xs')]: { minHeight: theme.spacing(5) },
  },
}));

const CustomInput: React.FC<{ currency: Currency } & InputBaseComponentProps> = ({
  inputRef,
  onChange,
  currency,
  ...other
}) => {
  const { decimalPlaces, thousandSeparator, decimalSeparator } = accountingConstants[currency];

  return (
    <NumberFormat
      getInputRef={inputRef}
      onValueChange={(values) => {
        if (!onChange) return;
        onChange({
          target: {
            name: other.name,
            value: values.floatValue && values.floatValue * 10 ** decimalPlaces,
          },
        } as any);
      }}
      decimalScale={decimalPlaces}
      fixedDecimalScale
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      {...((other as unknown) as NumberFormatProps)}
    />
  );
};

const FormikCurrencyField: React.FC<Props & TextFieldProps> = ({
  InputProps,
  currency: incomingCurrency,
  label,
  name,
  variant,
  ...props
}) => {
  const classes = useStyles();
  const [{ value, ...fieldProps }, { error, touched }] = useField(name);
  const hasError = !!error && touched;
  const currency = incomingCurrency || 'CLP';

  return (
    <TextField
      type="float"
      label={label}
      error={hasError}
      helperText={hasError && error}
      color="secondary"
      variant={variant || ('outlined' as any)}
      classes={classes}
      data-testid={`${name}Input`}
      value={value / 10 ** accountingConstants[currency].decimalPlaces}
      InputProps={{
        ...InputProps,
        startAdornment: <InputAdornment position="start">{currency}$</InputAdornment>,
        inputComponent: CustomInput as any,
        inputProps: { currency },
      }}
      {...props}
      {...fieldProps}
    />
  );
};

export default FormikCurrencyField;
