// React import
import React from 'react';

// Navigatiom import
import { createStackNavigator } from '@react-navigation/stack';

// AbuseAlarm screen import
import { AbuseAlarmListScreen } from '../views/abuse-alarm-list';
import { AbuseAlarmDetailsScreen } from '../views/abuse-alarm-details';

const Stack = createStackNavigator();

export const AbuseAlarmNavigator = ({ navigation }): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='AbuseAlarmList' component={AbuseAlarmListScreen}/>
    <Stack.Screen name='AbuseAlarmDetails' component={AbuseAlarmDetailsScreen}/>
  </Stack.Navigator>
);
