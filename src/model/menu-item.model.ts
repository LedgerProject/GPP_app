// React import
import React from 'react';

// React Native import
import { ImageStyle } from 'react-native';

export interface MenuItem {
  title: string;
  icon: (style: ImageStyle) => React.ReactElement;
  var_name: string;
  var_value: boolean;
}
