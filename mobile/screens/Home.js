import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => (
  <View style={styles.main}>
    <Text>Home</Text>
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
