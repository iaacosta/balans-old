import React from 'react';
import { View, StyleSheet } from 'react-native';

import ThemedText from '../components/typography/ThemedText';

const Home = () => (
  <View style={styles.main}>
    <ThemedText>Home</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
