import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#6D4482' },
    secondary: { main: '#009FB7' },
    success: { main: '#5CAD68', contrastText: '#fff' },
    error: { main: '#D63230' },
    warning: { main: '#F49D37' },
  },
});

export default theme;
