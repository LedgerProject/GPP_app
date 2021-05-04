// React import
import React from 'react';

// Navigation import
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { HomeNavigator } from './home.navigator';

/*
 * Navigation theming: https://reactnavigation.org/docs/en/next/themes.html
 */
const navigatorTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Prevent layout blinking when performing navigation
    background: 'transparent',
  },
};

export const AppNavigator = (): React.ReactElement => (
  <NavigationContainer theme={navigatorTheme}>
    <HomeNavigator/>
  </NavigationContainer>
);
