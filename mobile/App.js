import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import ThemeContext from './context/Theme';
import DrawerContent from './components/DrawerContent';
import Screen from './components/Screen';
import Home from './screens/Home';
import Movements from './screens/Movements';
import colors from './styles/colors';

const Drawer = createDrawerNavigator();

const App = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <NavigationContainer>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Drawer.Navigator
          initialRouteName="Home"
          edgeWidth={800}
          sceneContainerStyle={{ backgroundColor: colors[theme].background }}
          drawerContent={({ ...props }) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name="Home">
            {({ ...props }) => (
              <Screen {...props}>
                <Home {...props} />
              </Screen>
            )}
          </Drawer.Screen>
          <Drawer.Screen name="Movements">
            {({ ...props }) => (
              <Screen {...props}>
                <Movements {...props} />
              </Screen>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      </ThemeContext.Provider>
    </NavigationContainer>
  );
};

export default App;
