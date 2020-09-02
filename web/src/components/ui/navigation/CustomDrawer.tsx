import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Avatar,
  IconButton,
  ListItemAvatar,
  Collapse,
  Box,
} from '@material-ui/core';
import {
  InsertChart,
  AttachMoney,
  Place,
  People,
  ExpandMore,
  ExpandLess,
  ExitToApp,
  SupervisedUserCircleSharp,
  AccountBalanceWallet,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Category,
} from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';

import routing from '../../../constants/routing';
import { useMe } from '../../../hooks/auth/useMe';
import { useToggleable } from '../../../hooks/utils/useToggleable';
import { actions } from '../../../utils/rbac';
import { useLogout } from '../../../hooks/auth/useLogout';
import { AppState } from '../../../config/redux';
import { toggleTheme } from '../../../slices/themeSlice';
import ContainerLoader from '../misc/ContainerLoader';
import NavigationItem, { useNavigationItemStyles } from './NavigationItem';

const navigationItems = [
  {
    id: routing.authenticated.dashboard,
    action: actions.routes.dashboard,
    Icon: <InsertChart />,
    label: 'Dashboard',
    divides: false,
  },
  {
    id: routing.authenticated.accounts,
    action: actions.routes.transactions,
    Icon: <AccountBalanceWallet />,
    label: 'Accounts',
    divides: false,
  },
  {
    id: routing.authenticated.movements,
    action: actions.routes.movements,
    Icon: <AttachMoney />,
    label: 'Movements',
    divides: false,
  },
  {
    id: routing.authenticated.categories,
    action: actions.routes.categories,
    Icon: <Category />,
    label: 'Categories',
    divides: false,
  },
  {
    id: routing.authenticated.places,
    action: actions.routes.places,
    Icon: <Place />,
    label: 'Places',
    divides: false,
  },
  {
    id: routing.authenticated.people,
    action: actions.routes.people,
    Icon: <People />,
    label: 'People',
    divides: false,
  },
  {
    id: routing.authenticated.users,
    action: actions.routes.users,
    Icon: <SupervisedUserCircleSharp />,
    label: 'Users',
    divides: true,
  },
] as const;

const useStyles = makeStyles((theme) => ({
  content: { color: theme.palette.primary.contrastText, flex: 1 },
  footer: { padding: theme.spacing(1) },
  profileAvatar: { backgroundColor: theme.palette.secondary.main },
  profileName: { color: theme.palette.primary.contrastText },
  profileUsername: { color: theme.palette.primary.contrastText, opacity: 0.6 },
  profileListItem: { paddingLeft: theme.spacing(4), color: theme.palette.text.primary },
  profileList: {
    backgroundColor: theme.palette.background.default,
    borderRightColor: theme.palette.secondary.main,
    borderRightWidth: theme.spacing(0.25),
    borderRightStyle: 'solid',
  },
}));

const initialsFromName = (name: string) =>
  name
    .split(' ')
    .map((_name) => _name[0])
    .join('');

type Props = {
  onClose?: () => void;
};

const CustomDrawer: React.FC<Props> = ({ children, onClose }) => {
  const classes = useStyles();
  const itemClasses = useNavigationItemStyles();
  const logout = useLogout();
  const { user, loading } = useMe();
  const { toggled, toggle } = useToggleable();
  const { themeType } = useSelector((state: AppState) => state.theme);
  const dispatch = useDispatch();

  const handleThemeChange = () => {
    localStorage.setItem('theme', themeType === 'dark' ? 'light' : 'dark');
    dispatch(toggleTheme());
  };

  if (loading) return <ContainerLoader />;

  return (
    <>
      {children}
      <Box className={classes.content}>
        <List>
          {user && (
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.profileAvatar}>{initialsFromName(user.name)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                classes={{ primary: classes.profileName, secondary: classes.profileUsername }}
                primaryTypographyProps={{ 'data-testid': 'userFullName' } as never}
                primary={user.name}
                secondary={`@${user.username}`}
              />
              <IconButton onClick={toggle} size="small">
                {!toggled ? (
                  <ExpandMore className={itemClasses.icon} />
                ) : (
                  <ExpandLess className={itemClasses.icon} />
                )}
              </IconButton>
            </ListItem>
          )}
          <Collapse in={toggled} unmountOnExit>
            <List className={classes.profileList}>
              <ListItem button className={classes.profileListItem} onClick={logout}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Exit" />
              </ListItem>
            </List>
          </Collapse>
          {navigationItems.map((item) => (
            <NavigationItem key={item.id} item={item} onClose={onClose} />
          ))}
        </List>
      </Box>
      <Box className={classes.footer}>
        <IconButton className={itemClasses.icon} onClick={handleThemeChange}>
          {themeType === 'light' && <Brightness4Icon />}
          {themeType === 'dark' && <Brightness7Icon />}
        </IconButton>
      </Box>
    </>
  );
};

export default CustomDrawer;
