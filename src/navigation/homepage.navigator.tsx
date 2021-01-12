import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DocWalletNavigator } from './doc-wallet.navigator';
import { StructuresNavigator } from './structures.navigator';
import { HomepageScreen } from '../views/homepage';

const Stack = createStackNavigator();

export const HomepageNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Homepage' component={HomepageScreen}/>
    <Stack.Screen name='DocWallet' component={DocWalletNavigator}/>
    <Stack.Screen name='Structures' component={StructuresNavigator}/>
  </Stack.Navigator>
);
