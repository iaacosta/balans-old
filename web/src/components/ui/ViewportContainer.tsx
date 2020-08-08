import React from 'react';
import { makeStyles, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  main: {
    height: `calc(100vh - ${theme.spacing(12)}px)`,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ViewportContainer: React.FC = ({ children }) => {
  const classes = useStyles();
  return <Box className={classes.main}>{children}</Box>;
};

export default ViewportContainer;
