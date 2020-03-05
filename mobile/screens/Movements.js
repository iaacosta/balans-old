import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
