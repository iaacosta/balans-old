import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Avatar,
  IconButton,
  ListItemAvatar,
  Collapse,
  withStyles,
  Box,
} from '@material-ui/core';
import {
  InsertChartOutlined,
  AttachMoneyOutlined,
  AccountBalanceOutlined,
  Place,
  People,
  ExpandMore,
  ExpandLess,
  ExitToApp,
} from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import routing from '../../constants/routing';
import { useMe } from '../../hooks/useMe';
import { useToggleable } from '../../hooks/useToggleable';
import { removeToken } from '../../config/redux';
import Logo from './Logo';

const navigationItems = [
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
  drawer: {
    backgroundColor: theme.palette.primary.main,
    minWidth: theme.spacing(32),
    borderRight: 'none',
  },
  profileAvatar: { backgroundColor: theme.palette.secondary.main },
  profileName: { color: theme.palette.background.default },
  profileUsername: { color: theme.palette.background.default, opacity: 0.6 },
  profileIcon: { color: theme.palette.background.default },
  profileList: {
    backgroundColor: theme.palette.background.default,
    borderRightColor: theme.palette.secondary.main,
    borderRightWidth: theme.spacing(0.25),
    borderRightStyle: 'solid',
  },
  profileListItem: { paddingLeft: theme.spacing(4) },
}));

const WhiteListItemText = withStyles((theme) => ({
  primary: { color: theme.palette.background.default },
  secondary: { color: theme.palette.background.default, opacity: 0.6 },
}))(ListItemText);

const WhiteListIcon = withStyles((theme) => ({
  root: { color: theme.palette.background.default },
}))(ListItemIcon);

const initialsFromName = (name: string) =>
  name
    .split(' ')
    .map((_name) => _name[0])
    .join('');

const CustomDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { user, loading } = useMe();
  const { pathname } = useLocation();
  const { toggled, toggle } = useToggleable();

  if (loading) return null;

  const handleExit = () => {
    dispatch(removeToken());
    if (localStorage.getItem('x-auth')) localStorage.removeItem('x-auth');
  };

  return (
    <Drawer classes={{ paper: classes.drawer }} variant="permanent" anchor="left">
      <Box p={2} alignSelf="center">
        <Logo />
      </Box>
      <List>
        {user && (
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.profileAvatar}>{initialsFromName(user.name)}</Avatar>
            </ListItemAvatar>
            <WhiteListItemText
              classes={{ primary: classes.profileName, secondary: classes.profileUsername }}
              primaryTypographyProps={{ 'data-testid': 'userFullName' }}
              primary={user.name}
              secondary={`@${user.username}`}
            />
            <IconButton onClick={toggle} size="small">
              {!toggled ? (
                <ExpandMore className={classes.profileIcon} />
              ) : (
                <ExpandLess className={classes.profileIcon} />
              )}
            </IconButton>
          </ListItem>
        )}
        <Collapse in={toggled} unmountOnExit>
          <List className={classes.profileList}>
            <ListItem button className={classes.profileListItem} onClick={handleExit}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Exit" />
            </ListItem>
          </List>
        </Collapse>
        {navigationItems.map(({ id, Icon, label }) => (
          <ListItem component={Link} to={id} key={id} selected={id === pathname} button>
            <WhiteListIcon>{Icon}</WhiteListIcon>
            <WhiteListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default CustomDrawer;
