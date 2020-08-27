import React from 'react';
import { IconButtonProps, Portal } from '@material-ui/core';

import { useToggleable } from '../../hooks/utils/useToggleable';
import EnhancedIconButton, { EnhancedIconButtonColor } from './EnhancedIconButton';
import ResponsiveDialog from './ResponsiveDialog';

type Props<TProps> = {
  DialogProps: TProps;
  DialogComponent: React.FC<TProps & { onClose: () => void }>;
  color?: EnhancedIconButtonColor;
  contained?: boolean;
};

const DialogIconButton = <T extends Record<string, unknown>>({
  DialogComponent,
  DialogProps,
  contained,
  color,
  children,
  ...props
}: Props<T> & Omit<IconButtonProps, 'color'>): JSX.Element => {
  const { toggled, set } = useToggleable();

  return (
    <>
      <EnhancedIconButton
        contained={contained}
        color={color || 'primary'}
        onClick={() => set(true)}
        {...props}
      >
        {children}
      </EnhancedIconButton>
      <Portal>
        <ResponsiveDialog open={toggled} onClose={() => set(false)}>
          <DialogComponent {...DialogProps} onClose={() => set(false)} />
        </ResponsiveDialog>
      </Portal>
    </>
  );
};

export default DialogIconButton;
