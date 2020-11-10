import React from 'react';
import { makeStyles, Paper, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: theme.spacing(60),
    width: theme.spacing(90),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(3),
      width: '100%',
      minHeight: 0,
    },
  },
  invisibleBox: {
    padding: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
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
