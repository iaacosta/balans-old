import React from 'react';
import { FiberManualRecord as CircleIcon } from '@material-ui/icons';
import { IconProps, makeStyles } from '@material-ui/core';

interface Props {
  color?: string;
  size?: IconProps['fontSize'];
}

const useStyles = makeStyles((theme) => ({
  root: { '& .MuiSvgIcon-root': { boxShadow: theme.shadows[1] } },
}));

const CategoryIcon: React.FC<Props> = ({ color, size }) => {
  const classes = useStyles();
  return <CircleIcon fontSize={size || 'default'} classes={classes} htmlColor={color || '#eee'} />;
};

export default CategoryIcon;
