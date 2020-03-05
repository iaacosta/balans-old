import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../styles/colors';
import ThemeContext from '../context/Theme';

const Screen = ({ children, navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.app}>
      <View
        style={{ ...styles.header, backgroundColor: colors[theme].primary }}
      >
        <Icon
          style={styles.menu}
          onPress={() => navigation.openDrawer()}
          name="md-menu"
          size={30}
          color={colors.white}
        />
        <Text style={styles.logo}>Finanzie</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 50,
    padding: 15,
  },
  logo: {
    flex: 1,
    fontSize: 35,
    fontFamily: 'sans-serif-thin',
    textAlign: 'center',
    color: colors.white,
  },
});

export default Screen;
