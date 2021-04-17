import React from 'react';
import { Button, ButtonProps, Portal } from '@material-ui/core';

import { useToggleable } from '../../../hooks/utils/useToggleable';
import ResponsiveDialog from './ResponsiveDialog';
import DialogFormContext from '../../../contexts/DialogFormContext';

type Props = {
  buttonLabel: string;
};

const DialogButton: React.FC<Props & ButtonProps> = ({ children, buttonLabel, ...props }) => {
  const { toggled, set } = useToggleable();

  return (
    <DialogFormContext.Provider value={{ onClose: () => set(false) }}>
      <Button variant="contained" color="secondary" onClick={() => set(true)} {...props}>
        {buttonLabel}
      </Button>
      <Portal>
        <ResponsiveDialog open={toggled} onClose={() => set(false)}>
          {children}
        </ResponsiveDialog>
      </Portal>
    </DialogFormContext.Provider>
  );
};

export default DialogButton;
