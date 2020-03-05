import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { StyleSheet } from 'react-native';

import colors from '../styles/colors';

const getColor = type => {
  switch (type) {
    case 'primary':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'danger':
      return 'red';
    default:
      return 'grey';
  }
};

const Button = ({ type, children, onPress }) => {
  const baseColor = getColor(type);

  return (
    <TouchableHighlight onPress={onPress} underlayColor="white">
      <View style={{ ...styles.button, backgroundColor: colors[baseColor] }}>
        <Text style={styles.text}>{children}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    minWidth: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
});

export default Button;
