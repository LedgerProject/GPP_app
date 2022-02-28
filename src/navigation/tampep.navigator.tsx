// React import
import React from 'react';

// Navigation import
import { createStackNavigator } from '@react-navigation/stack';

// Contents screen import
import { TampepPage } from '../views/tampep-page';

const Stack = createStackNavigator();

export const TampepNavigator = ({ navigation }): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='TampepPage' component={TampepPage}/>
  </Stack.Navigator>
);
