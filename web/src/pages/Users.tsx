import React, { useMemo } from 'react';
import { Typography, makeStyles, Hidden } from '@material-ui/core';
import { useTabs } from '../hooks/utils/useTabs';
import ActiveUsersTable from '../components/users/ActiveUsersTable';
import ActiveUsersList from '../components/users/ActiveUsersList';
import DeletedUsersTable from '../components/users/DeletedUsersTable';
import DeletedUsersList from '../components/users/DeletedUsersList';
import ViewportContainer from '../components/ui/misc/ViewportContainer';
import CustomTabs from '../components/ui/navigation/CustomTabs';
import { useLocale } from '../hooks/utils/useLocale';

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(2) },
}));

const Users: React.FC = () => {
  const classes = useStyles();
  const { locale } = useLocale();
  const tabs = useMemo(
    () => [
      { key: 'active' as const, label: locale('users:tabs:active') },
      { key: 'deleted' as const, label: locale('users:tabs:deleted') },
    ],
    [locale],
  );

  const { selected, change } = useTabs({
    tabs: tabs.map(({ key }) => key),
    initialTab: 'active',
  });

  return (
    <ViewportContainer>
      <Typography className={classes.title} variant="h5">
        {locale('users:title')}
      </Typography>
      <CustomTabs tabs={tabs} selected={selected} change={change} />
      <Hidden xsDown implementation="js">
        {selected === 'active' && <ActiveUsersTable />}
        {selected === 'deleted' && <DeletedUsersTable />}
      </Hidden>
      <Hidden smUp implementation="js">
        {selected === 'active' && <ActiveUsersList />}
        {selected === 'deleted' && <DeletedUsersList />}
      </Hidden>
    </ViewportContainer>
  );
};

export default Users;
