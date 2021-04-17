/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useContext } from 'react';

import CategoryFormView from './CategoryFormView';
import DialogFormContext from '../../contexts/DialogFormContext';
import { useUpdateCategory } from '../../hooks/graphql';
import { MyCategoriesQuery } from '../../@types/graphql';

interface Props {
  category: MyCategoriesQuery['income'][number];
}

const UpdateCategoryDialog: React.FC<Props> = ({ category }) => {
  const { onClose } = useContext(DialogFormContext);
  const [updateCategory, { loading: updateLoading }] = useUpdateCategory();

  const initialValues = useMemo(
    () => ({
      name: category.name,
      color: category.color,
      type: category.type,
    }),
    [category],
  );

  return (
    <CategoryFormView
      mode="update"
      initialValues={initialValues}
      submitLoading={updateLoading}
      onSubmit={(values) => updateCategory(category.id, values, onClose)}
    />
  );
};

export default UpdateCategoryDialog;
