import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';

import ThemeContext from '../../context/Theme';
import colors from '../../styles/colors';

const H1 = ({ children, style }) => {
  const { theme } = useContext(ThemeContext);
  const color = theme === 'light' ? colors.light.primary : colors.dark.text;

  return <Text style={{ ...styles.default, ...style, color }}>{children}</Text>;
};

const styles = StyleSheet.create({
  default: {
    fontSize: 26,
    fontFamily: 'sans-serif-light',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default H1;
