// React import
import React from 'react';

// Navigation import
import { createStackNavigator } from '@react-navigation/stack';

// DocWallet screen import
import { DocWalletScreen } from '../views/doc-wallet';
import { DocDetailsScreen } from '../views/doc-details';

const Stack = createStackNavigator();

export const DocWalletNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='DocWallet' component={DocWalletScreen}/>
    <Stack.Screen name='DocDetails' component={DocDetailsScreen}/>
  </Stack.Navigator>
);
