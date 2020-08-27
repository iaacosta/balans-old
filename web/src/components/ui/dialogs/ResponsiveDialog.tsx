import React from 'react';
import { Dialog, DialogProps, makeStyles } from '@material-ui/core';
import { useBreakpoint } from '../../../hooks/utils/useBreakpoint';

const useStyles = makeStyles(() => ({
  paperFullScreen: { justifyContent: 'center' },
}));

const ResponsiveDialog: React.FC<DialogProps> = ({ children, maxWidth, classes, ...props }) => {
  const customClasses = useStyles();
  const isMobile = useBreakpoint({ layout: 'xs' });
  return (
    <Dialog
      {...props}
      classes={{ ...customClasses, ...classes }}
      fullScreen={isMobile}
      hideBackdrop={isMobile}
    >
      {children}
    </Dialog>
  );
};

export default ResponsiveDialog;
