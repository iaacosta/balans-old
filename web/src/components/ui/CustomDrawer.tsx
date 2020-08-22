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
  withStyles,
  Divider,
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
} from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import routing from '../../constants/routing';
import { useMe } from '../../hooks/useMe';
import { useToggleable } from '../../hooks/useToggleable';
import { actions } from '../../utils/rbac';
import { useCan } from '../../hooks/useRbac';
import { useLogout } from '../../hooks/useLogout';

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
  divider: { backgroundColor: theme.palette.background.default, opacity: 0.3 },
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

  if (loading) return null;

  return (
    <>
      {children}
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
                  <WhiteListIcon>{Icon}</WhiteListIcon>
                  <WhiteListItemText primary={label} />
                </ListItem>
              </React.Fragment>
            ),
        )}
      </List>
    </>
  );
};

export default CustomDrawer;
