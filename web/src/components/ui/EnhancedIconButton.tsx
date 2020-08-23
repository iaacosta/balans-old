import React from 'react';
import { makeStyles, IconButton, IconButtonProps, Theme } from '@material-ui/core';
import { useBreakpoint } from '../../hooks/utils/useBreakpoint';

type Color = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
type Props = {
  contained?: boolean;
  color?: Color;
};

const useStyles = makeStyles<Theme, Props>((theme) => {
  return {
    root: {
      backgroundColor: ({ contained, color }) =>
        contained && color ? theme.palette[color].main : 'transparent',
      color: ({ contained, color }) => {
        if (!color) return theme.palette.secondary.main;
        if (!contained) return theme.palette[color].main;
        return theme.palette[color].contrastText;
      },
      '&:hover': {
        backgroundColor: ({ contained, color }) => {
          if (!color || !contained) return theme.palette.action.hover;
          return theme.palette[color].dark;
        },
      },
      '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
      },
    },
  };
});

const EnhancedIconButton: React.FC<Props & Omit<IconButtonProps, 'color'>> = ({
  contained,
  color,
  children,
  ...props
}) => {
  const classes = useStyles({ contained, color });
  const isMobile = useBreakpoint({ layout: 'xs' });
  const iconButtonSize = isMobile ? 'small' : 'medium';

  return (
    <IconButton classes={classes} size={iconButtonSize} {...props}>
      {children}
    </IconButton>
  );
};

export default EnhancedIconButton;
