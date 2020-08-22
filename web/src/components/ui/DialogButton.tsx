import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

import { useToggleable } from '../../hooks/useToggleable';

type Props = {
  buttonLabel: string;
  DialogComponent: React.FC<{ open: boolean; onClose: () => void }>;
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
      <DialogComponent open={toggled} onClose={() => set(false)} />
    </>
  );
};

export default DialogButton;
