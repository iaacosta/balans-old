import React from 'react';
import { View, StyleSheet } from 'react-native';
import numeral from 'numeral';

import ThemedText from '../../components/typography/ThemedText';
import H3 from '../../components/typography/H3';

const Summary = ({ label, children, type }) => {
  const formatted = numeral(children).format(
    type === 'currency' ? '$ (0,0)' : '0',
  );

  let fontSize = 40;

  if (
    (type === 'currency' && formatted.length > 16) ||
    (type === 'number' && formatted.length > 8)
  ) {
    fontSize = 30;
  }

  const marginRight = type === 'currency' ? 15 : 0;
  const flex = type === 'currency' ? 2 : 1;

  return (
    <View
      style={{
        ...styles.wrapper,
        marginRight,
        flex,
      }}
    >
      <H3 style={styles.label}>{label}</H3>
      <ThemedText style={{ ...styles.value, fontSize }}>{formatted}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, display: 'flex' },
  label: { marginBottom: 5 },
  value: { alignSelf: 'flex-end' },
});

export default Summary;
