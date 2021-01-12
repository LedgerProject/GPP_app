import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DocWalletScreen } from '../views/doc-wallet';

const Stack = createStackNavigator();

export const DocWalletNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='DocWallet' component={DocWalletScreen}/>
  </Stack.Navigator>
);
