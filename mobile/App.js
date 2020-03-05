import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerContent from './components/DrawerContent';
import Screen from './components/Screen';

import Home from './screens/Home';
import Movements from './screens/Movements';

const Drawer = createDrawerNavigator();

const App = () => (
  <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Home"
      edgeWidth={800}
      drawerContent={DrawerContent}
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
  </NavigationContainer>
);

export default App;
