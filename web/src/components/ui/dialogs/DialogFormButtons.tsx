import React, { useContext } from 'react';
import { Button, DialogActions, ButtonProps } from '@material-ui/core';

import FormikSubmitButton from '../../formik/FormikSubmitButton';
import DialogFormContext from '../../../contexts/DialogFormContext';

type Props = {
  loading: boolean;
};

const DialogFormButtons: React.FC<Props & ButtonProps> = ({ children, loading, ...props }) => {
  const { onClose } = useContext(DialogFormContext);

  return (
    <DialogActions>
      <Button onClick={() => onClose()} color="secondary">
        Cancel
      </Button>
      <FormikSubmitButton color="primary" loading={loading} {...props}>
        {children || 'Go'}
      </FormikSubmitButton>
    </DialogActions>
  );
};

export default DialogFormButtons;
