import React from 'react';
import { FiberManualRecord as CircleIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';

interface Props {
  color?: string;
  size?: number;
}

const useStyles = makeStyles((theme) => ({
  root: { '& .MuiSvgIcon-root': { boxShadow: theme.shadows[1] } },
}));

const CategoryIcon: React.FC<Props> = ({ color }) => {
  const classes = useStyles();
  return <CircleIcon classes={classes} htmlColor={color || '#eee'} />;
};

export default CategoryIcon;
