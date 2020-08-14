import React from 'react';
import { makeStyles, Box, BoxProps } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  main: {
    height: `calc(100vh - ${theme.spacing(12)}px)`,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ViewportContainer: React.FC<BoxProps> = ({ children, className, ...props }) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.main, className)} {...props}>
      {children}
    </Box>
  );
};

export default ViewportContainer;
