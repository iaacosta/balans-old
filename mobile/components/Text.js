import React, { useContext } from 'react';
import { Text as _Text } from 'react-native';

import ThemeContext from '../context/Theme';
import colors from '../styles/colors';

const Text = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return <_Text style={{ color: colors[theme].text }}>{children}</_Text>;
};

export default Text;
