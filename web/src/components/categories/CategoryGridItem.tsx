import React from 'react';
import { Paper, makeStyles } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { MyCategoriesQuery } from '../../@types/graphql';
import CategorySelectItem from '../ui/misc/CategorySelectItem';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';
import { useDeleteCategory } from '../../hooks/graphql/category';

interface Props {
  category: MyCategoriesQuery['income'][number];
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
  category: { flex: 1 },
}));

const CategoryGridItem: React.FC<Props> = ({ category }) => {
  const classes = useStyles();
  const [deleteCategory, { loading }] = useDeleteCategory();

  return (
    <Paper data-testid={`category${category.id}`} className={classes.paper} elevation={1}>
      <CategorySelectItem className={classes.category} category={category} />
      <EnhancedIconButton size="small" disabled contained color="info">
        <EditIcon fontSize="small" />
      </EnhancedIconButton>
      <EnhancedIconButton
        size="small"
        contained
        color="error"
        disabled={loading}
        data-testid={`deleteCategory${category.id}`}
        onClick={() => deleteCategory(category.id)}
      >
        <DeleteIcon fontSize="small" />
      </EnhancedIconButton>
    </Paper>
  );
};

export default CategoryGridItem;
