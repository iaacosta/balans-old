import React from 'react';
import { makeStyles, Box, BoxProps } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  main: {
    height: `calc(100vh - ${theme.spacing(6 * 2)}px)`,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - ${theme.spacing(6 * 2)}px - ${theme.mixins.toolbar.minHeight}px)`,
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - ${theme.spacing(2 * 2)}px - ${theme.mixins.toolbar.minHeight}px)`,
    },
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
