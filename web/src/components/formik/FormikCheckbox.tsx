import React from 'react';
import { CheckboxProps, FormControlLabel, Checkbox } from '@material-ui/core';
import { useField } from 'formik';

interface Props {
  name: string;
  label: string;
}

const FormikCheckbox: React.FC<Props & CheckboxProps> = ({ name, label, ...props }) => {
  const [fieldProps] = useField(name);
  return (
    <FormControlLabel
      data-testid={`${name}Input`}
      control={<Checkbox color="secondary" {...fieldProps} {...props} />}
      label={label}
    />
  );
};

export default FormikCheckbox;
