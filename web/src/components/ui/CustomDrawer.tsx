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
  Divider,
  Box,
} from '@material-ui/core';
import {
  InsertChart,
  AttachMoney,
  AccountBalance,
  Place,
  People,
  ExpandMore,
  ExpandLess,
  ExitToApp,
  SupervisedUserCircleSharp,
  AccountBalanceWallet,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import routing from '../../constants/routing';
import { useMe } from '../../hooks/auth/useMe';
import { useToggleable } from '../../hooks/utils/useToggleable';
import { actions } from '../../utils/rbac';
import { useCan } from '../../hooks/auth/useRbac';
import { useLogout } from '../../hooks/auth/useLogout';
import { AppState } from '../../config/redux';
import { toggleTheme } from '../../slices/themeSlice';
import ContainerLoader from './ContainerLoader';

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
    id: routing.authenticated.transactions,
    action: actions.routes.movements,
    Icon: <AttachMoney />,
    label: 'Transactions',
    divides: false,
  },
  {
    id: routing.authenticated.otherMovements,
    action: actions.routes.otherMovements,
    Icon: <AccountBalance />,
    label: 'Loans and debts',
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
  icon: { color: theme.palette.primary.contrastText },
  profileAvatar: { backgroundColor: theme.palette.secondary.main },
  profileName: { color: theme.palette.primary.contrastText },
  profileUsername: { color: theme.palette.primary.contrastText, opacity: 0.6 },
  profileList: {
    backgroundColor: theme.palette.background.default,
    borderRightColor: theme.palette.secondary.main,
    borderRightWidth: theme.spacing(0.25),
    borderRightStyle: 'solid',
  },
  profileListItem: { paddingLeft: theme.spacing(4), color: theme.palette.text.primary },
  divider: { backgroundColor: theme.palette.primary.contrastText, opacity: 0.3 },
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
  const { canPerform } = useCan();
  const classes = useStyles();
  const logout = useLogout();
  const { user, loading } = useMe();
  const { pathname } = useLocation();
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
                  <ExpandMore className={classes.icon} />
                ) : (
                  <ExpandLess className={classes.icon} />
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
          {navigationItems.map(
            ({ id, Icon, label, action, divides }) =>
              canPerform(action) && (
                <React.Fragment key={id}>
                  {divides && <Divider className={classes.divider} />}
                  <ListItem
                    onClick={() => onClose && onClose()}
                    component={Link}
                    to={id}
                    selected={id === pathname}
                    button
                  >
                    <ListItemIcon className={classes.icon}>{Icon}</ListItemIcon>
                    <ListItemText primary={label} />
                  </ListItem>
                </React.Fragment>
              ),
          )}
        </List>
      </Box>
      <Box className={classes.footer}>
        <IconButton className={classes.icon} onClick={handleThemeChange}>
          {themeType === 'light' && <Brightness4Icon />}
          {themeType === 'dark' && <Brightness7Icon />}
        </IconButton>
      </Box>
    </>
  );
};

export default CustomDrawer;
