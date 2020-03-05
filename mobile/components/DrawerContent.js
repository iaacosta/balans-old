import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import DrawerItem from './DrawerItem';
import colors from '../styles/colors';
import ThemeContext from '../context/Theme';

const DrawerContent = ({ navigation, state }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={{ ...styles.drawer, backgroundColor: colors[theme].primary }}>
      <View style={styles.items}>
        {state.routeNames.map(name => (
          <DrawerItem key={name} onPress={() => navigation.navigate(name)}>
            {name}
          </DrawerItem>
        ))}
      </View>
      <View style={styles.footer}>
        <Ionicon name="md-settings" size={30} color={colors.white} />
        <MaterialIcon
          name={`lightbulb${theme === 'light' ? '' : '-outline'}`}
          size={30}
          color={colors.white}
          onPress={toggleTheme}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  items: {
    flex: 1,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  drawer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
  },
});

export default DrawerContent;
