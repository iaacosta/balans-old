import React from 'react';
import { Button, ButtonProps, Portal } from '@material-ui/core';

import { useToggleable } from '../../../hooks/utils/useToggleable';
import ResponsiveDialog from './ResponsiveDialog';

type Props = {
  buttonLabel: string;
  DialogComponent: React.FC<{ onClose: () => void }>;
};

const DialogButton: React.FC<Props & ButtonProps> = ({
  buttonLabel,
  DialogComponent,
  ...props
}) => {
  const { toggled, set } = useToggleable();

  return (
    <>
      <Button variant="contained" color="secondary" onClick={() => set(true)} {...props}>
        {buttonLabel}
      </Button>
      <Portal>
        <ResponsiveDialog open={toggled} onClose={() => set(false)}>
          <DialogComponent onClose={() => set(false)} />
        </ResponsiveDialog>
      </Portal>
    </>
  );
};

export default DialogButton;
