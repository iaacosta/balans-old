/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';

import CategoryFormView from './CategoryFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import colors from '../../constants/colors';
import { useCreateCategory } from '../../hooks/graphql/category';
import { CategoryType } from '../../@types/graphql';

const CreateCategoryDialog: React.FC = () => {
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
      onSubmit={(values) => createCategory(values, onClose)}
    />
  );
};

export default CreateCategoryDialog;
