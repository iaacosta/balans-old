import React, { useContext } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import colors from '../styles/colors';
import ThemeContext from '../context/Theme';

const MovementButton = ({ type, onPress }) => {
  const { theme } = useContext(ThemeContext);

  const color = ['income', 'loan'].includes(type)
    ? colors[theme].success
    : ['expense', 'debt'].includes(type)
    ? colors[theme].danger
    : colors[theme].neutral;

  const Icon = ({ ...props }) => {
    switch (type) {
      case 'expense':
        return <Ionicons name="md-remove" {...props} />;
      case 'income':
        return <Ionicons name="md-add" {...props} />;
      case 'loan':
        return (
          <View style={styles.iconWrapper}>
            <Ionicons name="md-add" {...props} />
            <Ionicons
              name="md-person"
              {...props}
              size={15}
              style={styles.smallIcon}
            />
          </View>
        );
      case 'debt':
        return (
          <View style={styles.iconWrapper}>
            <Ionicons name="md-remove" {...props} />
            <Ionicons
              name="md-person"
              {...props}
              size={15}
              style={styles.smallIcon}
            />
          </View>
        );
      case 'transfer':
        return <Ionicons name="ios-swap" {...props} />;
      default:
        throw new Error(`no Icon for type ${type}`);
    }
  };

  return (
    <TouchableHighlight
      style={styles.button}
      onPress={onPress}
      underlayColor={colors[theme].background}
    >
      <View style={{ ...styles.wrapper, borderColor: color }}>
        <Icon size={25} color={color} />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 75,
    width: 75,
    display: 'flex',
  },
  wrapper: {
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: { position: 'relative' },
  smallIcon: { position: 'absolute', right: -5, bottom: -5 },
});

export default MovementButton;
