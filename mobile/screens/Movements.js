import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../components/Text';

const Movements = () => (
  <View style={styles.app}>
    <View style={styles.main}>
      <Text>Movements</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  app: { flex: 1 },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Movements;
