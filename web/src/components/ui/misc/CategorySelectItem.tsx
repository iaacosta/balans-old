import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
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

type Props = { category: MyCategoriesQuery['income'][number]; className?: string };

const CategorySelectItem: React.FC<Props> = ({ category: { name, color }, className }) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.wrapper, className)} display="flex" alignItems="center">
      <CategoryIcon color={color} />
      <Typography variant="body1">{name}</Typography>
    </Box>
  );
};

export default CategorySelectItem;
