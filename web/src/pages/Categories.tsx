import React from 'react';
import { Typography, makeStyles, Paper, Box, Grid } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import { useMyCategories } from '../hooks/graphql/category';
import ContainerLoader from '../components/ui/misc/ContainerLoader';
import CategoriesGrid from '../components/categories/CategoriesGrid';
import DialogButton from '../components/ui/dialogs/DialogButton';
import CreateCategoryDialog from '../components/categories/CreateCategoryDialog';
import { useLocale } from '../hooks/utils/useLocale';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(1) },
  paper: {
    flex: 1,
    padding: theme.spacing(4),
    display: 'flex',
    overflow: 'auto',
    [theme.breakpoints.down('xs')]: { padding: theme.spacing(2) },
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const Categories: React.FC = () => {
  const classes = useStyles();
  const { locale } = useLocale();
  const { income, expense, loading } = useMyCategories();

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        {locale('categories:title')}
      </Typography>
      <Paper elevation={1} className={classes.paper}>
        {loading && <ContainerLoader />}
        <Grid container spacing={2}>
          {!!expense && (
            <Grid item xs={12} lg={6}>
              <Typography className={classes.title} variant="overline">
                {locale('categories:expense')}
              </Typography>
              <CategoriesGrid categories={expense} />
            </Grid>
          )}
          {!!income && (
            <Grid item xs={12} lg={6}>
              <Typography className={classes.title} variant="overline">
                {locale('categories:income')}
              </Typography>
              <CategoriesGrid categories={income} />
            </Grid>
          )}
        </Grid>
      </Paper>
      <Box className={classes.buttonWrapper}>
        <DialogButton
          buttonLabel={locale('categories:create')}
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
