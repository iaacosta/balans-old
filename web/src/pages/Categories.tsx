import React from 'react';
import { Typography, makeStyles, Paper, Box, Divider } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import clsx from 'clsx';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import { useMyCategories } from '../hooks/graphql/category';
import ContainerLoader from '../components/ui/misc/ContainerLoader';
import CategoriesGrid from '../components/categories/CategoriesGrid';
import DialogButton from '../components/ui/dialogs/DialogButton';
import CreateCategoryDialog from '../components/categories/CreateCategoryDialog';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
  paper: { flex: 1, padding: theme.spacing(2), display: 'flex' },
  side: { flex: 1 },
  leftSide: { marginRight: theme.spacing(2) },
  rightSide: { marginLeft: theme.spacing(2) },
  grid: { marginTop: theme.spacing(2) },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const Categories: React.FC = () => {
  const classes = useStyles();
  const { income, expense, loading } = useMyCategories();

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        My categories
      </Typography>
      <Paper elevation={1} className={classes.paper}>
        {loading && <ContainerLoader />}
        {!!expense && (
          <Box className={clsx(classes.side, classes.leftSide)}>
            <Typography variant="overline">Expenses</Typography>
            <Box className={classes.grid}>
              <CategoriesGrid categories={expense} />
            </Box>
          </Box>
        )}
        <Divider orientation="vertical" />
        {!!income && (
          <Box className={clsx(classes.side, classes.rightSide)}>
            <Typography variant="overline">Income</Typography>
            <Box className={classes.grid}>
              <CategoriesGrid categories={income} />
            </Box>
          </Box>
        )}
      </Paper>
      <Box className={classes.buttonWrapper}>
        <DialogButton
          buttonLabel="Add new category"
          data-testid="createCategoryButton"
          startIcon={<AddIcon />}
        >
          <CreateCategoryDialog />
        </DialogButton>
      </Box>
    </ViewportContainer>
  );
};

export default Categories;
