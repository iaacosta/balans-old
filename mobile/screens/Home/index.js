import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { View, StyleSheet } from 'react-native';
import { Bars } from 'react-native-loader';

import ThemedText from '../../components/typography/ThemedText';
import { GET_HOME_ACCOUNTS } from '../../graphql';
import colors from '../../styles/colors';
import ThemeContext from '../../context/Theme';
import Summary from './Summary';
import Actions from './Actions';

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const [balance, setBalance] = useState(0);
  const [notBilled, setNotBilled] = useState(0);
  const { data, loading } = useQuery(GET_HOME_ACCOUNTS);

  useEffect(() => {
    if (!loading && data) {
      const [_balance, _notBilled] = data.getAccounts.reduce(
        (accum, curr) => [accum[0] + curr.balance, accum[1] + curr.balance],
        [0, 0],
      );

      setBalance(_balance);
      setNotBilled(_notBilled);
    }
  }, [data, loading]);

  return (
    <>
      {loading ? (
        <View style={styles.wrapper}>
          <Bars size={30} color={colors[theme].primary} spaceBetween={8} />
        </View>
      ) : (
        <View style={styles.main}>
          <View style={styles.graphs}>
            <ThemedText>You should see a graph here</ThemedText>
          </View>
          <View style={styles.summaries}>
            <View style={styles.summaryRow}>
              <Summary type="currency" label="Actual balance">
                {balance}
              </Summary>
              <Summary type="number" label="Pending debts">
                4
              </Summary>
            </View>
            <View style={styles.summaryRow}>
              <Summary type="currency" label="Real balance">
                {notBilled}
              </Summary>
              <Summary type="number" label="Pending loans">
                4
              </Summary>
            </View>
          </View>
          <View style={styles.actions}>
            <Actions />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    padding: 20,
    display: 'flex',
  },
  graphs: {
    flex: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaries: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 25,
    marginTop: 10,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryRow: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default Home;
