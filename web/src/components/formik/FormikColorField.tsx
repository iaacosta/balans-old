/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { makeStyles, TextField, TextFieldProps, Menu } from '@material-ui/core';
import { useField } from 'formik';
import { CirclePicker } from 'react-color';
import colors from '../../constants/colors';
import CategoryIcon from '../ui/misc/CategoryIcon';

type Props = {
  name: string;
  label: string;
  options: string[];
};

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: theme.spacing(10),
    [theme.breakpoints.down('xs')]: { minHeight: theme.spacing(5) },
  },
}));

const useMenuStyles = makeStyles((theme) => ({
  paper: { padding: theme.spacing(2) },
}));

const FormikColorField: React.FC<Props & TextFieldProps> = ({
  name,
  label,
  variant,
  fullWidth,
  color,
  options,
  ...props
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const classes = useStyles();
  const menuClasses = useMenuStyles();
  const [{ onChange, ...fieldProps }, { error, touched }, { setValue }] = useField(name);
  const hasError = !!error && touched;

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
  const handleClose = () => setAnchor(null);

  return (
    <>
      <TextField
        variant={variant || ('outlined' as any)}
        color={color || 'secondary'}
        error={hasError}
        helperText={hasError && error}
        label={label}
        classes={classes}
        fullWidth={fullWidth}
        data-testid={`${name}Input`}
        InputProps={{ startAdornment: <CategoryIcon color={fieldProps.value} size={24} /> }}
        onDoubleClick={(event) => event.preventDefault()}
        onClick={handleOpen}
        {...props}
        {...fieldProps}
      />
      <Menu classes={menuClasses} anchorEl={anchor} open={!!anchor} onClose={handleClose}>
        <CirclePicker
          colors={colors}
          onChange={({ hex }) => {
            setValue(hex);
            handleClose();
          }}
        />
      </Menu>
    </>
  );
};

export default FormikColorField;
