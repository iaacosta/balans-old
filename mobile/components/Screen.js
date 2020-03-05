import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../styles/colors';

const Screen = ({ children, navigation }) => (
  <View style={styles.app}>
    <View style={styles.header}>
      <Icon
        style={styles.menu}
        onPress={() => navigation.openDrawer()}
        name="md-menu"
        size={30}
        color={colors.white}
      />
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
    flexDirection: 'row',
    height: 50,
    padding: 15,
  },
  logo: {
    flex: 1,
    fontSize: 35,
    color: colors.white,
    fontFamily: 'sans-serif-thin',
    textAlign: 'center',
  },
});

export default Screen;
