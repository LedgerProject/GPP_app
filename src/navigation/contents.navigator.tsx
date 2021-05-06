// React import
import React from 'react';

// Navigation import
import { createStackNavigator } from '@react-navigation/stack';

// Contents screen import
import { ContentsListScreen } from '../views/contents-list';
import { ContentsDetailsScreen } from '../views/contents-details';

const Stack = createStackNavigator();

export const ContentsNavigator = ({ navigation }): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='ContentsList' component={ContentsListScreen}/>
    <Stack.Screen name='ContentsDetails' component={ContentsDetailsScreen}/>
  </Stack.Navigator>
);
