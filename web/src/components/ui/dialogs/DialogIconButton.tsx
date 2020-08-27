import React from 'react';
import { IconButtonProps, Portal } from '@material-ui/core';

import { useToggleable } from '../../../hooks/utils/useToggleable';
import EnhancedIconButton, { EnhancedIconButtonColor } from '../misc/EnhancedIconButton';
import ResponsiveDialog from './ResponsiveDialog';
import DialogFormContext from '../../../contexts/DialogFormContext';

type Props = {
  color?: EnhancedIconButtonColor;
  icon: React.ReactNode;
  contained?: boolean;
};

const DialogIconButton: React.FC<Props & Omit<IconButtonProps, 'color'>> = ({
  contained,
  color,
  icon,
  children,
  ...props
}) => {
  const { toggled, set } = useToggleable();

  return (
    <DialogFormContext.Provider value={{ onClose: () => set(false) }}>
      <EnhancedIconButton
        contained={contained}
        color={color || 'primary'}
        onClick={() => set(true)}
        {...props}
      >
        {icon}
      </EnhancedIconButton>
      <Portal>
        <ResponsiveDialog open={toggled} onClose={() => set(false)}>
          {children}
        </ResponsiveDialog>
      </Portal>
    </DialogFormContext.Provider>
  );
};

export default DialogIconButton;
