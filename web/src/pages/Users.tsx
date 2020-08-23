import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { useTabs } from '../hooks/utils/useTabs';
import ActiveUsersTable from '../components/users/ActiveUsersTable';
import DeletedUsersTable from '../components/users/DeletedUsersTable';
import ViewportContainer from '../components/ui/ViewportContainer';
import CustomTabs from '../components/ui/CustomTabs';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
}));

const tabs = [
  { key: 'active' as const, label: 'Active users' },
  { key: 'deleted' as const, label: 'Deleted users' },
];

const Users: React.FC = () => {
  const classes = useStyles();
  const { selected, change } = useTabs({
    tabs: tabs.map(({ key }) => key),
    initialTab: 'active',
  });

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        Platform users
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      {selected === 'active' && <ActiveUsersTable />}
      {selected === 'deleted' && <DeletedUsersTable />}
    </ViewportContainer>
  );
};

export default Users;
