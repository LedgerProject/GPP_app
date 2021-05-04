// React import
import React from 'react';

// Navigation import
import { createStackNavigator } from '@react-navigation/stack';

// News&Stories screen import
import { NewsStoriesListScreen } from '../views/news-stories-list';
import { NewsStoriesDetailsScreen } from '../views/news-stories-details';

const Stack = createStackNavigator();

export const NewsStoriesNavigator = ({ navigation }): React.ReactElement => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='NewsStoriesList' component={NewsStoriesListScreen}/>
    <Stack.Screen name='NewsStoriesDetails' component={NewsStoriesDetailsScreen}/>
  </Stack.Navigator>
);
