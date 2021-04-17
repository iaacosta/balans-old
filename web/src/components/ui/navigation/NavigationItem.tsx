import React from 'react';
import { ListItem, ListItemIcon, ListItemText, makeStyles, Divider } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { Action } from '../../../utils/rbac';
import { useCan } from '../../../hooks/auth/useRbac';

export const useNavigationItemStyles = makeStyles((theme) => ({
  icon: { color: theme.palette.primary.contrastText },
  divider: { backgroundColor: theme.palette.primary.contrastText, opacity: 0.3 },
}));

type NavigationItemProps = {
  item: {
    id: string;
    action: Action;
    Icon: JSX.Element;
    label: string;
    divides?: boolean;
  };
  onClose?: () => void;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  item: { id, Icon, action, label, divides },
  onClose,
}) => {
  const classes = useNavigationItemStyles();
  const { pathname } = useLocation();
  const { canPerform } = useCan();

  if (!canPerform(action)) return null;

  return (
    <>
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
    </>
  );
};

export default NavigationItem;
