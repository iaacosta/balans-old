import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../components/Text';

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
