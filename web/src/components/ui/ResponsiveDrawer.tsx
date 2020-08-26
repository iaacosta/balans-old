import React from 'react';
import { Hidden, Drawer, makeStyles, AppBar, IconButton, Toolbar, Box } from '@material-ui/core';
import { Menu as MenuIcon, Close as CloseIcon } from '@material-ui/icons';

import CustomDrawer from './CustomDrawer';
import { useToggleable } from '../../hooks/utils/useToggleable';
import Logo from './Logo';

const useStyles = makeStyles((theme) => ({
  drawer: {
    backgroundColor: theme.palette.primary.main,
    minWidth: theme.spacing(32),
    borderRight: 'none',
  },
  whiteIcon: { color: theme.palette.primary.contrastText },
  clearfix: theme.mixins.toolbar,
  mobileToolbar: {
    padding: theme.spacing(0, 1),
    '& > *:not(:last-child)': { marginRight: theme.spacing(1) },
  },
}));

const ResponsiveDrawer: React.FC = () => {
  const classes = useStyles();
  const { toggled, toggle, set } = useToggleable();

  return (
    <>
      <Hidden mdUp implementation="js">
        <AppBar position="fixed">
          <Toolbar disableGutters className={classes.mobileToolbar}>
            <IconButton className={classes.whiteIcon} onClick={toggle}>
              <MenuIcon />
            </IconButton>
            <Logo />
          </Toolbar>
        </AppBar>
        <Drawer
          onClose={() => set(false)}
          open={toggled}
          classes={{ paper: classes.drawer }}
          ModalProps={{ keepMounted: true }}
        >
          <CustomDrawer onClose={() => set(false)}>
            <Box pr={1} pt={1} mb={-1} alignSelf="flex-end">
              <IconButton className={classes.whiteIcon} onClick={toggle}>
                <CloseIcon />
              </IconButton>
            </Box>
          </CustomDrawer>
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="js">
        <Drawer classes={{ paper: classes.drawer }} variant="permanent" anchor="left">
          <CustomDrawer>
            <Box p={2} alignSelf="center">
              <Logo />
            </Box>
          </CustomDrawer>
        </Drawer>
      </Hidden>
    </>
  );
};

export default ResponsiveDrawer;
