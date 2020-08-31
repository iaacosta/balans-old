import React from 'react';
import { Grid } from '@material-ui/core';
import { MyCategoriesQuery } from '../../@types/graphql';
import CategoryGridItem from './CategoryGridItem';

interface Props {
  categories: MyCategoriesQuery['income'];
}

const CategoriesGrid: React.FC<Props> = ({ categories }) => (
  <Grid container spacing={2} alignItems="flex-start">
    {categories.map((category) => (
      <Grid item key={category.id} xs={12} md={6}>
        <CategoryGridItem category={category} />
      </Grid>
    ))}
  </Grid>
);

export default CategoriesGrid;
