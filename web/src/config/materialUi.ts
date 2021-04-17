import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { ResponsiveFontSizesOptions } from '@material-ui/core/styles/responsiveFontSizes';

const responsiveFontOptions: ResponsiveFontSizesOptions = { factor: 3 };

export const lightTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: { main: '#6D4482' },
      secondary: { main: '#009FB7' },
      success: { main: '#5CAD68', contrastText: '#fff' },
      error: { main: '#D63230' },
      warning: { main: '#F49D37' },
    },
  }),
  responsiveFontOptions,
);

export const darkTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
      primary: { main: '#222831' },
      secondary: { main: '#00B8AB' },
      success: { main: '#77BB81' },
      info: { main: '#4f9ccf' },
      error: { main: '#ec625f' },
      warning: { main: '#ffc045' },
    },
  }),
  responsiveFontOptions,
);
