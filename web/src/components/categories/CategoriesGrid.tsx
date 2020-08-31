import React from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { MyCategoriesQuery } from '../../@types/graphql';
import CategorySelectItem from '../ui/misc/CategorySelectItem';
import EnhancedIconButton from '../ui/misc/EnhancedIconButton';

interface Props {
  categories: MyCategoriesQuery['income'];
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
  category: { flex: 1 },
}));

const CategoriesGrid: React.FC<Props> = ({ categories }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} alignItems="flex-start">
      {categories.map((category) => (
        <Grid item key={category.id} xs={12} md={6}>
          <Paper className={classes.paper} elevation={1}>
            <CategorySelectItem className={classes.category} category={category} />
            <EnhancedIconButton size="small" disabled contained color="info">
              <EditIcon fontSize="small" />
            </EnhancedIconButton>
            <EnhancedIconButton size="small" disabled contained color="error">
              <DeleteIcon fontSize="small" />
            </EnhancedIconButton>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoriesGrid;
