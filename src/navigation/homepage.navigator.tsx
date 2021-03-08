import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DocWalletNavigator } from './doc-wallet.navigator';
import { StructuresNavigator } from './structures.navigator';
import { MyProfileScreen } from '../views/my-profile';
import { HomepageScreen } from '../views/homepage';
import { SettingsScreen } from '../views/settings';
import { ChangePasswordScreen } from '../views/change-password';
import { CompliantsScreen } from '../views/compliants';
import { CompliantEditScreen } from '../views/compliant-edit';

const Stack = createStackNavigator();

export const HomepageNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Home' component={HomepageScreen}/>
    <Stack.Screen name='DocWallet' component={DocWalletNavigator}/>
    <Stack.Screen name='Structures' component={StructuresNavigator}/>
    <Stack.Screen name='MyProfile' component={MyProfileScreen}/>
    <Stack.Screen name='Settings' component={SettingsScreen}/>
    <Stack.Screen name='ChangePassword' component={ChangePasswordScreen}/>
    <Stack.Screen name='Compliants' component={CompliantsScreen}/>
    <Stack.Screen name='CompliantEdit' component={CompliantEditScreen}/>
  </Stack.Navigator>
);
