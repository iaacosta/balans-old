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
import routing from '../../constants/routing';
import { useMe } from '../../hooks/useMe';

const items = [
  {
    id: 'dashboard',
    Icon: <InsertChartOutlined />,
    label: 'Dashboard',
    link: routing.authenticated.dashboard,
    inactive: false,
  },
  {
    id: 'movements',
    Icon: <AttachMoneyOutlined />,
    label: 'Expenses and incomes',
    link: null,
    inactive: true,
  },
  {
    id: 'otherMovements',
    Icon: <AccountBalanceOutlined />,
    label: 'Loans and debts',
    link: null,
    inactive: true,
  },
  {
    id: 'places',
    Icon: <Place />,
    label: 'Places',
    link: null,
    inactive: true,
  },
  {
    id: 'people',
    Icon: <People />,
    label: 'People',
    link: null,
    inactive: true,
  },
];

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

const CustomDrawer: React.FC = () => {
  const classes = useStyles();
  const { user, loading } = useMe();

  if (loading) return null;

  return (
    <Drawer classes={{ paper: classes.drawer }} variant="permanent" anchor="left">
      {user && (
        <Box className={classes.profile}>
          <Avatar className={classes.profileAvatar}>
            {user.name
              .split(' ')
              .map((name) => name[0])
              .join('')}
          </Avatar>
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
          <ListItem className={classes.listItem} button key={id}>
            <ListItemIcon className={classes.listItemIcon}>{Icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default CustomDrawer;
