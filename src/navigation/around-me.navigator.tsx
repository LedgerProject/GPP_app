// React import
import React from 'react';

// Navigation import
import { createStackNavigator } from '@react-navigation/stack';

// AroundMe screen import
import { AroundMeMapScreen } from '../views/around-me-map';
import { AroundMeListScreen } from '../views/around-me-list';
import { AroundMeDetailsScreen } from '../views/around-me-details';
import { AroundMeCountryScreen } from '../views/around-me-country';

const Stack = createStackNavigator();

export const AroundMeNavigator = ({ navigation }): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='AroundMeMap' component={AroundMeMapScreen}/>
    <Stack.Screen name='AroundMeList' component={AroundMeListScreen}/>
    <Stack.Screen name='AroundMeDetails' component={AroundMeDetailsScreen}/>
    <Stack.Screen name='AroundMeCountry' component={AroundMeCountryScreen}/>
  </Stack.Navigator>
);
