import React from 'react';
import { ButtonProps, Button, makeStyles, Box, CircularProgress } from '@material-ui/core';

interface Props {
  loading: boolean;
  size?: number;
}

const useStyles = makeStyles((theme) => ({
  wrapper: { position: 'relative' },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -theme.spacing(1.5),
    marginLeft: -theme.spacing(1.5),
  },
}));

const FormikSubmitButton: React.FC<Props & ButtonProps> = ({
  loading,
  size = 24,
  children,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Button type="submit" variant="contained" disabled={loading} fullWidth {...props}>
        {children}
      </Button>
      {loading && <CircularProgress size={size} className={classes.buttonProgress} />}
    </Box>
  );
};

export default FormikSubmitButton;
