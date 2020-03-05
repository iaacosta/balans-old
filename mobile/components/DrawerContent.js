import React from 'react';
import { StyleSheet, View } from 'react-native';

import DrawerItem from './DrawerItem';
import colors from '../styles/colors';

const DrawerContent = ({ navigation, state }) => (
  <View style={styles.drawer}>
    {state.routeNames.map(name => (
      <DrawerItem key={name} onPress={() => navigation.navigate(name)}>
        {name}
      </DrawerItem>
    ))}
  </View>
);

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: colors.green,
  },
});

export default DrawerContent;
