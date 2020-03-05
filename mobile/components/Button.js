import React, { useContext } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { StyleSheet } from 'react-native';

import colors from '../styles/colors';
import ThemeContext from '../context/Theme';

const Button = ({ type, children, onPress }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableHighlight onPress={onPress} underlayColor="white">
      <View style={{ ...styles.button, backgroundColor: colors[theme][type] }}>
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
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    color: colors.white,
  },
});

export default Button;
