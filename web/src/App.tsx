import React from 'react';
import { Box, makeStyles } from '@material-ui/core';

import Authenticate from './pages/Authenticate';

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <Box className={classes.main}>
      <Authenticate />
    </Box>
  );
};

export default App;
