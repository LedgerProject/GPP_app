// React import
import React from 'react';

// Navigation import
import { createStackNavigator } from '@react-navigation/stack';
import { DocWalletNavigator } from './doc-wallet.navigator';
import { AroundMeNavigator } from './around-me.navigator';
import { AbuseAlarmNavigator } from './abuse-alarm.navigator';
import { NewsStoriesNavigator } from './news-stories.navigator';

// Screen import
import { HomepageScreen } from '../views/homepage';
import { MyProfileScreen } from '../views/my-profile';
import { SettingsScreen } from '../views/settings';
import { ChangePasswordScreen } from '../views/change-password';

const Stack = createStackNavigator();

export const HomepageNavigator = (): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Home' component={HomepageScreen}/>
    <Stack.Screen name='DocWallet' component={DocWalletNavigator}/>
    <Stack.Screen name='AroundMe' component={AroundMeNavigator}/>
    <Stack.Screen name='AbuseAlarm' component={AbuseAlarmNavigator}/>
    <Stack.Screen name='NewsStories' component={NewsStoriesNavigator}/>
    <Stack.Screen name='MyProfile' component={MyProfileScreen}/>
    <Stack.Screen name='Settings' component={SettingsScreen}/>
    <Stack.Screen name='ChangePassword' component={ChangePasswordScreen}/>
  </Stack.Navigator>
);
