import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useMyFintualGoals } from '../../hooks/graphql';
import DialogButton from '../ui/dialogs/DialogButton';
import ContainerLoader from '../ui/misc/ContainerLoader';
import FintualGoalCard from './FintualGoalCard';
import RegisterFintualCredentialsDialog from './RegisterFintualCredentialsDialog';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& > *:not(:last-child)': { marginBottom: theme.spacing(2) },
  },
}));

const FintualGoals: React.FC = () => {
  const classes = useStyles();
  const { goals, loading, error } = useMyFintualGoals();

  if (loading) return <ContainerLoader />;

  return (
    <>
      <Grid container spacing={3}>
        {goals?.map((goal) => (
          <Grid item xs={12} sm={6}>
            <FintualGoalCard goal={goal} />
          </Grid>
        ))}
      </Grid>
      {error && (
        <Box className={classes.main}>
          <Typography variant="caption" color="textSecondary">
            You must fetch an API token first!
          </Typography>
          <DialogButton color="secondary" variant="contained" buttonLabel="Log in here">
            <RegisterFintualCredentialsDialog />
          </DialogButton>
        </Box>
      )}
    </>
  );
};

export default FintualGoals;
