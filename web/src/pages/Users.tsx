import React from 'react';
import { Typography, Tabs, Tab, makeStyles, Paper } from '@material-ui/core';
import { useTabs } from '../hooks/useTabs';
import ActiveUsersTable from '../components/users/ActiveUsersTable';
import DeletedUsersTable from '../components/users/DeletedUsersTable';
import ViewportContainer from '../components/ui/ViewportContainer';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
  paper: { display: 'inline-block', alignSelf: 'flex-start' },
}));

const Users: React.FC = () => {
  const classes = useStyles();
  const { selected, change } = useTabs({
    tabs: ['active', 'deleted'] as const,
    initialTab: 'active',
  });

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        Platform users
      </Typography>
      <Paper className={classes.paper} elevation={1}>
        <Tabs
          textColor="secondary"
          value={selected}
          onChange={(event, value) => change(value as 'active' | 'deleted')}
        >
          <Tab value="active" label="Active users" />
          <Tab value="deleted" label="Deleted users" />
        </Tabs>
      </Paper>
      {selected === 'active' && <ActiveUsersTable />}
      {selected === 'deleted' && <DeletedUsersTable />}
    </ViewportContainer>
  );
};

export default Users;
