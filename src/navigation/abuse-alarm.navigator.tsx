// React import
import React from 'react';

// Navigatiom import
import { createStackNavigator } from '@react-navigation/stack';

// AbuseAlarm screen import
import { ContentsListScreen } from '../views/contents-list';
import { ContentsDetailsScreen } from '../views/contents-details';

const Stack = createStackNavigator();

export const AbuseAlarmNavigator = ({ navigation }): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='AbuseAlarmList' component={ContentsListScreen}/>
    <Stack.Screen name='AbuseAlarmDetails' component={ContentsDetailsScreen}/>
  </Stack.Navigator>
);
