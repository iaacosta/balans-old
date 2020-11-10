import React from 'react';
import { IconButton } from '@material-ui/core';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../slices/themeSlice';
import { useNavigationItemStyles } from './NavigationItem';
import { AppState } from '../../../config/redux';

const ChangeTheme: React.FC = () => {
  const itemClasses = useNavigationItemStyles();
  const dispatch = useDispatch();
  const { themeType } = useSelector((state: AppState) => state.theme);

  const handleThemeChange = () => {
    localStorage.setItem('theme', themeType === 'dark' ? 'light' : 'dark');
    dispatch(toggleTheme());
  };

  return (
    <IconButton className={itemClasses.icon} onClick={handleThemeChange}>
      {themeType === 'light' && <Brightness4Icon />}
      {themeType === 'dark' && <Brightness7Icon />}
    </IconButton>
  );
};

export default ChangeTheme;
