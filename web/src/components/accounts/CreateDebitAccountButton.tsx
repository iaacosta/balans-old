import React from 'react';
import { Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useToggleable } from '../../hooks/useToggleable';
import CreateDebitAccountDialog from './CreateDebitAccountDialog';

const CreateDebitAccountButton: React.FC = () => {
  const { toggled, set } = useToggleable();

  return (
    <>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => set(true)}>
        Create new debit account
      </Button>
      {toggled && <CreateDebitAccountDialog open={toggled} onClose={() => set(false)} />}
    </>
  );
};

export default CreateDebitAccountButton;
