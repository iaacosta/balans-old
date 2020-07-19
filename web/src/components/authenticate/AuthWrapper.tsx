import React from 'react';
import { makeStyles, Paper, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: theme.spacing(60),
    width: theme.spacing(80),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invisibleBox: {
    padding: theme.spacing(10),
  },
}));

const AuthWrapper: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.paper}>
      <Box className={classes.invisibleBox}>{children}</Box>
    </Paper>
  );
};

export default AuthWrapper;
