import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedText from '../components/typography/ThemedText';

const Movements = () => (
  <View style={styles.app}>
    <View style={styles.main}>
      <ThemedText>Movements</ThemedText>
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
