import React, { useContext } from 'react';
import { Button, DialogActions, ButtonProps } from '@material-ui/core';

import FormikSubmitButton from '../../formik/FormikSubmitButton';
import DialogFormContext from '../../../contexts/DialogFormContext';
import { useLocale } from '../../../hooks/utils/useLocale';

type Props = {
  loading: boolean;
};

const DialogFormButtons: React.FC<Props & ButtonProps> = ({ children, loading, ...props }) => {
  const { onClose } = useContext(DialogFormContext);
  const { locale } = useLocale();

  return (
    <DialogActions>
      <Button onClick={() => onClose()} color="secondary">
        {locale('forms:cancel')}
      </Button>
      <FormikSubmitButton color="primary" loading={loading} {...props}>
        {children || locale('forms:go')}
      </FormikSubmitButton>
    </DialogActions>
  );
};

export default DialogFormButtons;
