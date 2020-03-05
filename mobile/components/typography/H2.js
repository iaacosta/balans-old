import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';

import ThemeContext from '../../context/Theme';
import colors from '../../styles/colors';

const H1 = ({ children, style }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Text style={{ ...styles.default, ...style, color: colors[theme].text }}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: 22,
    fontFamily: 'sans-serif',
  },
});

export default H1;
