import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { MyCategoriesQuery } from '../../../@types/graphql';
import CategoryIcon from './CategoryIcon';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));

const CategorySelectItem: React.FC<{ category: MyCategoriesQuery['income'][number] }> = ({
  category: { name, color },
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper} display="flex" alignItems="center">
      <CategoryIcon color={color} />
      <Typography variant="body1">{name}</Typography>
    </Box>
  );
};

export default CategorySelectItem;
