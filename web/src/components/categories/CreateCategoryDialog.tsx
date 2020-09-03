/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';
import { useSnackbar } from 'notistack';

import CategoryFormView from './CategoryFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import colors from '../../constants/colors';
import { useCreateCategory } from '../../hooks/graphql/category';
import { CategoryType } from '../../@types/graphql';
import { handleError } from '../../utils/errors';

const CreateCategoryDialog: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { onClose } = useContext(DialogFormContext);
  const [createCategory, { loading: createLoading }] = useCreateCategory();

  const initialValues = useMemo(
    () => ({
      name: '',
      color: colors[0],
      type: 'income' as CategoryType,
    }),
    [],
  );

  return (
    <CategoryFormView
      mode="create"
      initialValues={initialValues}
      submitLoading={createLoading}
      onSubmit={async (values) => {
        try {
          await createCategory(values);
          enqueueSnackbar('Category created successfully', { variant: 'success' });
          onClose();
        } catch (err) {
          handleError(err, (message) => enqueueSnackbar(message, { variant: 'error' }));
        }
      }}
    />
  );
};

export default CreateCategoryDialog;
