/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { InputAdornment, InputBaseComponentProps, TextFieldProps } from '@material-ui/core';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import FormikTextField from './FormikTextField';

interface Props {
  name: string;
  label: string;
}

const CustomInput: React.FC<InputBaseComponentProps> = ({ inputRef, onChange, ...other }) => (
  <NumberFormat
    getInputRef={inputRef}
    onValueChange={(values) => {
      if (!onChange) return;
      onChange({ target: { name: other.name, value: values.floatValue } } as any);
    }}
    thousandSeparator="."
    decimalSeparator=","
    {...((other as unknown) as NumberFormatProps)}
  />
);

const FormikCurrencyField: React.FC<Props & Omit<TextFieldProps, 'type'>> = ({
  InputProps,
  ...props
}) => (
  <FormikTextField
    {...props}
    InputProps={{
      ...InputProps,
      startAdornment: <InputAdornment position="start">$</InputAdornment>,
      inputComponent: CustomInput,
    }}
  />
);

export default FormikCurrencyField;
