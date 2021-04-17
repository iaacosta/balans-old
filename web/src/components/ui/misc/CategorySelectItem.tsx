import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { MyCategoriesQuery } from '../../../@types/graphql';
import CategoryIcon from './CategoryIcon';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  text: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' },
}));

type Props = { category: MyCategoriesQuery['income'][number]; className?: string };

const CategorySelectItem: React.FC<Props> = ({ category: { name, color }, className }) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.wrapper, className)} display="flex" alignItems="center">
      <CategoryIcon color={color} />
      <Typography className={classes.text} variant="body1">
        {name}
      </Typography>
    </Box>
  );
};

export default CategorySelectItem;
