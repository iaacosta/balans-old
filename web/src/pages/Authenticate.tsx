import React from 'react';
import { Paper, makeStyles, Typography, Box } from '@material-ui/core';
import LoginForm from '../components/authenticate/LoginForm';
import useTabs from '../hooks/useTabs';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(5),
    minWidth: '35vw',
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Authenticate: React.FC = () => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.paper}>
      <LoginForm />
    </Paper>
  );
};

export default Authenticate;
