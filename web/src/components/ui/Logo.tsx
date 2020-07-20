import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: { fontSize: theme.typography.h5.fontSize, color: theme.palette.background.default },
}));

const Logo: React.FC = () => {
  const classes = useStyles();
  return (
    <Typography classes={classes} variant="h1">
      balans
    </Typography>
  );
};

export default Logo;
