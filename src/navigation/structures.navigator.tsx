import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WhereIAmMapScreen } from '../views/where-i-am-map';
import { WhereIAmListScreen } from '../views/where-i-am-list';
import { WhereIAmDetailsScreen } from '../views/where-i-am-details';
import { WhereIAmCountryScreen } from '../views/where-i-am-country';

const Stack = createStackNavigator();

export const StructuresNavigator = ({ navigation }): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='WhereIAmMap' component={WhereIAmMapScreen}/>
    <Stack.Screen name='WhereIAmList' component={WhereIAmListScreen}/>
    <Stack.Screen name='WhereIAmDetails' component={WhereIAmDetailsScreen}/>
    <Stack.Screen name='WhereIAmCountry' component={WhereIAmCountryScreen}/>
  </Stack.Navigator>    
);