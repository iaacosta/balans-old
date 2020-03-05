import React, { useContext } from 'react';
import { Text, StyleSheet } from 'react-native';

import ThemeContext from '../../context/Theme';
import colors from '../../styles/colors';

const ThemedText = ({ children, style }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Text style={{ ...styles.text, ...style, color: colors[theme].text }}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'sans-serif-light',
    fontSize: 16,
  },
});

export default ThemedText;
