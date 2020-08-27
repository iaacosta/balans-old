import React from 'react';
import { makeStyles, Box, CircularProgress, CircularProgressProps } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const ContainerLoader: React.FC<CircularProgressProps> = (props) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CircularProgress {...props} />
    </Box>
  );
};

export default ContainerLoader;
