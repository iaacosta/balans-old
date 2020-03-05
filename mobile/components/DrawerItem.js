import React from 'react';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Text, StyleSheet, View } from 'react-native';
import colors from '../styles/colors';

const DrawerItem = ({ children, onPress }) => (
  <TouchableHighlight onPress={onPress} underlayColor="white">
    <View style={styles.button}>
      <Text style={styles.text}>{children}</Text>
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    margin: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: 'sans-serif-light',
    color: colors.white,
  },
});

export default DrawerItem;
