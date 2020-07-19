import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Avatar,
  Box,
  Typography,
  IconButton,
} from '@material-ui/core';
import {
  InsertChartOutlined,
  AttachMoneyOutlined,
  AccountBalanceOutlined,
  Place,
  People,
  ExpandMore,
} from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import routing from '../../constants/routing';
import { useMe } from '../../hooks/useMe';

const items = [
  {
    id: routing.authenticated.dashboard.path,
    Icon: <InsertChartOutlined />,
    label: 'Dashboard',
  },
  {
    id: routing.authenticated.movements.path,
    Icon: <AttachMoneyOutlined />,
    label: 'Expenses and incomes',
  },
  {
    id: routing.authenticated.otherMovements.path,
    Icon: <AccountBalanceOutlined />,
    label: 'Loans and debts',
  },
  {
    id: routing.authenticated.places.path,
    Icon: <Place />,
    label: 'Places',
  },
  {
    id: routing.authenticated.people.path,
    Icon: <People />,
    label: 'People',
  },
] as const;

const useStyles = makeStyles((theme) => ({
  drawer: { backgroundColor: theme.palette.primary.main, minWidth: theme.spacing(32) },
  profile: { padding: theme.spacing(2), display: 'flex', alignItems: 'center' },
  profileAvatar: { backgroundColor: theme.palette.secondary.main },
  profileInfo: { flex: 1, color: theme.palette.background.default, marginLeft: theme.spacing(2) },
  profileUsername: { opacity: 0.6 },
  profileIcon: { color: theme.palette.background.default },
  listItem: { color: theme.palette.background.default },
  listItemIcon: { color: theme.palette.background.default },
}));

const initialsFromName = (name: string) =>
  name
    .split(' ')
    .map((_name) => _name[0])
    .join('');

const CustomDrawer: React.FC = () => {
  const classes = useStyles();
  const { user, loading } = useMe();
  const { pathname } = useLocation();

  if (loading) return null;

  return (
    <Drawer classes={{ paper: classes.drawer }} variant="permanent" anchor="left">
      {user && (
        <Box className={classes.profile}>
          <Avatar className={classes.profileAvatar}>{initialsFromName(user.name)}</Avatar>
          <Box className={classes.profileInfo}>
            <Typography variant="body1">{user.name}</Typography>
            <Typography className={classes.profileUsername} variant="caption">
              @{user.username}
            </Typography>
          </Box>
          <IconButton>
            <ExpandMore className={classes.profileIcon} />
          </IconButton>
        </Box>
      )}
      <List>
        {items.map(({ id, Icon, label }) => (
          <ListItem
            key={id}
            component={Link}
            selected={id === pathname}
            to={id}
            className={classes.listItem}
            button
          >
            <ListItemIcon className={classes.listItemIcon}>{Icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default CustomDrawer;
