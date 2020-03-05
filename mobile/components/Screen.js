import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import colors from '../styles/colors';

const Screen = ({ children }) => (
  <View style={styles.app}>
    <View style={styles.header}>
      <Text style={styles.logo}>Finanzie</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.green,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  logo: {
    fontSize: 35,
    color: colors.white,
    fontFamily: 'sans-serif-thin',
  },
});

export default Screen;
