import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { useLocale } from '../../../hooks/utils/useLocale';
import { Locale, LocaleKeys } from '../../../@types/locales';
import { useNavigationItemStyles } from './NavigationItem';

const ChangeLocale: React.FC = () => {
  const classes = useNavigationItemStyles();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { changeLocale, i18n, locale } = useLocale();

  const handleOpen = (element: HTMLElement) => setAnchor(element);
  const handleClose = () => setAnchor(null);

  const handleChange = async (newLocale: Locale) => {
    await changeLocale(newLocale);
    handleClose();
  };

  const isOpen = !!anchor;

  return (
    <Box>
      <Button
        className={classes.icon}
        endIcon={isOpen ? <ArrowDropDown /> : <ArrowDropUp />}
        onClick={(event) => handleOpen(event.currentTarget)}
      >
        {locale(`navbar:${i18n.language}` as LocaleKeys)}
      </Button>
      <Menu open={isOpen} anchorEl={anchor} onClose={handleClose}>
        <MenuItem onClick={() => handleChange('es')}>{locale('navbar:es')}</MenuItem>
        <MenuItem onClick={() => handleChange('en')}>{locale('navbar:en')}</MenuItem>
      </Menu>
    </Box>
  );
};

export default ChangeLocale;
